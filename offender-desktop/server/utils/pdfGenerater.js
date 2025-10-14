import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import db from "../config/db.js";

export async function generateOffenderPDF(offenderId) {
  const outDir = "server/pdfs";
  fs.mkdirSync(outDir, { recursive: true });
  const filePath = path.join(outDir, `offender_${offenderId}.pdf`);

  const [[o]] = await db.query(`SELECT * FROM offenders WHERE id=?`, [offenderId]);
  if (!o) throw new Error("Ялтан олдсонгүй.");

  const [addr] = await db.query(`SELECT * FROM offender_addresses WHERE offender_id=?`, [offenderId]);
  const [emp] = await db.query(`SELECT * FROM offender_employments WHERE offender_id=?`, [offenderId]);
  const [house] = await db.query(`SELECT * FROM household_members WHERE offender_id=?`, [offenderId]);
  const [rel] = await db.query(`SELECT * FROM relatives WHERE offender_id=?`, [offenderId]);
  const [dam] = await db.query(`SELECT * FROM damages WHERE offender_id=?`, [offenderId]);
  const [crime] = await db.query(`SELECT * FROM crime_details WHERE offender_id=?`, [offenderId]);
  const [co] = await db.query(`SELECT * FROM co_offenders WHERE offender_id=?`, [offenderId]);
  const [sent] = await db.query(`SELECT * FROM court_sentences WHERE offender_id=?`, [offenderId]);
  const [chg] = await db.query(`SELECT * FROM sentence_changes WHERE offender_id=?`, [offenderId]);
  const [rec] = await db.query(`SELECT * FROM offender_records WHERE offender_id=?`, [offenderId]);

  const safe = (v) => (v ? String(v).replace(/\r?\n|\r/g, " ") : "");
  const fmt = (d) => (d ? new Date(d).toLocaleDateString("mn-MN") : "");

  const html = `
  <html lang="mn">
  <head>
  <meta charset="UTF-8">
  <title>Маягт Т-1</title>
  <style>
      body {
        font-family: "Arial", serif;
        font-size: 11pt;
        line-height: 1.55;
        margin: 50px 70px;
        position: relative;
      }
      h1, h2 { text-align: center; font-weight: bold; margin: 0; }
      h1 { font-size: 14pt; margin-top: 5px; }
      h2 { font-size: 13pt; margin-bottom: 15px; }

      p {
        margin: 2px 0;
        text-align: justify;
        line-height: 1.4;
        word-break: break-word;
        text-indent: 0;
      }
      

      .divider {
        border-top: 1.5px solid #000;
        margin: 15px 0 10px 0;
      }

      .signature-area {
        margin-top: 80px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end; /* 🟢 доод шугамуудыг ижил түвшинд гаргана */
        text-align: center;
      }
      
      .sig-block {
        width: 45%;
      }
      
      .sig-name {
        font-weight: bold;
        text-align: center;
        margin-bottom: 35px; /* 🟢 нэр болон шугамын хоорондын зай */
      }
      
      .sig-line {
        border-top: 1px solid #000;
        width: 80%;
        margin: 0 auto;
      }
      
      .sig-caption {
        font-size: 11pt;
        margin-top: 5px;
        text-align: center;
      }
      
      .footer {
        position: absolute;
        right: 0;
        bottom: 20px;
        font-weight: bold;
        font-size: 11pt;
      }

      .line {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin: 2px 0;
      }
      
      .line p {
        width: 48%;
        margin: 2px 0;
      }

      .right {
        text-align: right;
        margin-right: 0;
        padding-right: 10px;
        display: block;
        width: 100%;
      }
      
      
    </style>
  </head>
  <body>

  <p class="right">
    Шүүхийн шийдвэр гүйцэтгэх ерөнхий газрын<br>
    даргын 2025 оны ..... дугаар сарын .....-ны өдрийн ..... дугаар тушаалын хоёрдугаар хавсралт
  </p>
  <p class="right">Маягт Т-1</p>

  <h1>ТОРГОХ ЯЛ ШИЙТГҮҮЛСЭН</h1>
  <h2>ЯЛТНЫ ДЭЛГЭРЭНГҮЙ БҮРТГЭЛ</h2>

  <div class="line"><p>1. Ургийн овог: ${safe(o.clan_name)}</p><p>2. Овог: ${safe(o.surname)}</p></div>
  <div class="line"><p>3. Нэр: ${safe(o.given_name)}</p><p>4. Регистрийн дугаар: ${safe(o.register_no)}</p></div>
  <div class="line"><p>5. Хүйс: ${safe(o.gender)}</p><p>6. Үндсэн захиргаа: ${safe(o.main_authority)}</p></div>
  <div class="line"><p>7. Төрсөн: ${fmt(o.birth_date)}</p><p>8. Яс үндэс: ${safe(o.ethnicity)}</p></div>
  <div class="line"><p>9. Нийгмийн гарал: ${safe(o.social_origin)}</p><p>10. Боловсрол: ${safe(o.education)}</p></div>
  <div class="line"><p>11. Мэргэжил: ${safe(o.profession)}</p><p>Утас: ${safe(o.phone)}</p></div>

  <p>12. Шийтгэгдэхээс өмнө болон одоо оршин сууж буй хаяг:</p>
  <p>${addr.map(a => safe(a.full_address)).join("; ") || "—"}</p>

  <p>13. Шийтгэгдэхийн өмнө болон одоо ажиллаж буй байгууллага:</p>
  <p>${emp.map(e => safe(e.org_name)).join("; ") || "—"}</p>

  <p>14. Ял эдлэх үеийн биеийн эрүүл мэндийн байдал: ${safe(o.health_status)}</p>
  <p>15. Ам бүл: ${safe(o.household_text)}</p>

  <br>

  <p><b>15.1 Ам бүлийн гишүүд:</b></p>
  <table style="width:100%; border-collapse:collapse; font-size:11pt;">
    <thead>
      <tr>
        <th style="border:1px solid #000;">Д/д</th>
        <th style="border:1px solid #000;">Овог нэр</th>
        <th style="border:1px solid #000;">Хэн болох</th>
        <th style="border:1px solid #000;">Хаана ямар ажил эрхэлдэг</th>
        <th style="border:1px solid #000;">Оршин суух хаяг</th>
        <th style="border:1px solid #000;">Холбоо барих утас</th>
      </tr>
    </thead>
    <tbody>
      ${house.length
      ? house.map((h, i) => `
            <tr>
              <td style="border:1px solid #000;">${i + 1}</td>
              <td style="border:1px solid #000;">${safe(h.full_name)}</td>
              <td style="border:1px solid #000;">${safe(h.relation)}</td>
              <td style="border:1px solid #000;">${safe(h.employer)}</td>
              <td style="border:1px solid #000;">${safe(h.address)}</td>
              <td style="border:1px solid #000;">${safe(h.phone)}</td>
            </tr>`).join("")
      : `<tr><td colspan="6" style="text-align:center;border:1px solid #000;">Бүртгэл байхгүй</td></tr>`
    }
    </tbody>
  </table>

  <p><b>16. Төрөл төрөгсөд, ах дүүс, ойр дотны хүмүүс:</b></p>
  <table style="width:100%; border-collapse:collapse; font-size:11pt;">
    <thead>
      <tr>
        <th style="border:1px solid #000;">Д/д</th>
        <th style="border:1px solid #000;">Овог нэр</th>
        <th style="border:1px solid #000;">Оршин суух хаяг, утас</th>
        <th style="border:1px solid #000;">Эрхэлж буй ажил</th>
      </tr>
    </thead>
    <tbody>
      ${rel.length
      ? rel.map((r, i) => `
            <tr>
              <td style="border:1px solid #000;">${i + 1}</td>
              <td style="border:1px solid #000;">${safe(r.full_name)}</td>
              <td style="border:1px solid #000;">${safe(r.address)}, ${safe(r.phone)}</td>
              <td style="border:1px solid #000;">${safe(r.occupation)}</td>
            </tr>`).join("")
      : `<tr><td colspan="4" style="text-align:center;border:1px solid #000;">Бүртгэл байхгүй</td></tr>`
    }
    </tbody>
  </table>

  <p><b>17. Иргэд байгууллагад учруулсан хохирол: ${dam[0]?.total_amount || "____"}₮</b></p>
  <p style="margin-left:25px;">
    Төлсөн дүн: ${dam[0]?.paid_amount || "____"}₮<br>
    Үлдэгдэл: ${(dam[0]?.total_amount || 0) - (dam[0]?.paid_amount || 0)}₮
  </p>

  <p>18. Гэмт хэрэг үйлдсэн шалтгаан: ${safe(crime[0]?.cause)}</p>
  <p>19. Хэргийн товч утга: ${safe(crime[0]?.summary)}</p>
  <p>20. Хамтран хэрэг үйлдэгчийн ургийн овог, овог, нэр: 
    ${co.map(c => `${safe(c.clan_name)} ${safe(c.surname)} ${safe(c.given_name)}`).join(", ") || "Байхгүй"}</p>
  <p>21. Үндсэн ял: ${safe(crime[0]?.main_punishment)}</p>
  <p>22. Ялаас зайлсхийсэн эсэх: ${crime[0]?.evaded ? "Тийм" : "Үгүй"}</p>
  <p>
  <!-- 23-р зүйл -->
  <p>
    23. ${safe(sent[0]?.court_name) || ".............."} шүүхийн 
    ${fmt(sent[0]?.decision_date) || ".........."}-ны өдрийн 
    ${safe(sent[0]?.decision_no) || ".........."} дугаар шийтгэх тогтоолоор 
    Эрүүгийн хуулийн ${safe(sent[0]?.criminal_article) || ".........."}-р зүйл ангиар 
    ${safe(sent[0]?.fine_amount_mnt ? sent[0].fine_amount_mnt / 1000 : ".......")} нэгж буюу 
    ${safe(sent[0]?.fine_amount_mnt) || ".........."} төгрөгийн торгох ялаар шийтгэгдсэн.
  </p>
  
  <p>
    Урьд ял шийтгэгдэж байсан эсэх: 
    ${safe(crime[0]?.previous_sentence) || "Байхгүй /зүйл анги, ялын хэмжээ/"}
  </p>
  
  <p class="tight-text">
    24. Ялтны гадаад, дотоод төрх, зан төлөвийн байдал, хувцаслалт:
    ${safe(o.appearance_note) || "/ярилцлага ажиглалтын/"}
  </p>
  
  <p>
    25. Анхан шатны шүүхээс оногдуулсан ялд өөрчлөлт орсон эсэх:
    ${chg.length ? "Өөрчлөлт орсон" : "Өөрчлөлт ороогүй"}
  </p>
  <p>
    Ялын төрөл, зүйл анги: 
    ${chg.length ? safe(chg[0]?.sentence_type) : safe(sent[0]?.criminal_article) || "............."}
  </p>
  

  <br><br>
  <div class="divider"></div>

  <p>Бүртгэл нээсэн: ${fmt(rec[0]?.opened_date)} </p>
  <p>Бүртгэл хаасан: ${fmt(rec[0]?.closed_date)} </p>

  <div class="signature-area">
  <div class="sig-block">
    <p class="sig-name">ШИЙДВЭР ГҮЙЦЭТГЭГЧ: ${safe(rec[0]?.executor_name)}</p>
    <div class="sig-line"></div>
    <p class="sig-caption">/гарын үсэг/</p>
  </div>
  <div class="sig-block">
    <p class="sig-name">ЯЛТАН: ${safe(o.given_name)}</p>
    <div class="sig-line"></div>
    <p class="sig-caption">/гарын үсэг/</p>
  </div>
</div>






  </body>
  </html>`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  await page.pdf({
    path: filePath,
    format: "A4",
    printBackground: true,
    margin: { top: "15mm", right: "8mm", bottom: "15mm", left: "15mm" },
  });

  await browser.close();
  return filePath;
}
