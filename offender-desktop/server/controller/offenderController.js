import db from "../config/db.js";
import { generateOffenderPDF } from "../utils/pdfGenerater.js";

/** 🔹 1. Ялтныг бүртгэх (бүх холбоотой хүснэгтүүдтэй хамт) */
export const createFullOffender = async (req, res) => {
  const offender = req.body;

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    /** ✅ 1. Үндсэн ялтангийн мэдээлэл */
    const [offenderResult] = await connection.query(
      `INSERT INTO offenders 
        (clan_name, surname, given_name, register_no, gender, main_authority, birth_date, ethnicity, 
         social_origin, education, profession, phone, health_status, household_text, appearance_note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        offender.clan_name,
        offender.surname,
        offender.given_name,
        offender.register_no,
        offender.gender,
        offender.main_authority,
        offender.birth_date,
        offender.ethnicity,
        offender.social_origin,
        offender.education,
        offender.profession,
        offender.phone,
        offender.health_status,
        offender.household_text,
        offender.appearance_note,
      ]
    );

    const offenderId = offenderResult.insertId;

    /** ✅ 2. Оршин суугаа хаяг */
    if (offender.address_previous || offender.address_current) {
      const addresses = [
        ["өмнөх", offender.address_previous],
        ["одоогийн", offender.address_current],
      ].filter((a) => a[1]);
      for (const [type, addr] of addresses) {
        await connection.query(
          `INSERT INTO offender_addresses (offender_id, addr_type, full_address)
           VALUES (?, ?, ?)`,
          [offenderId, type, addr]
        );
      }
    }

    /** ✅ 3. Ажил эрхлэлт */
    if (offender.work_previous || offender.work_current) {
      const works = [
        ["өмнөх", offender.work_previous],
        ["одоогийн", offender.work_current],
      ].filter((w) => w[1]);
      for (const [type, org] of works) {
        await connection.query(
          `INSERT INTO offender_employments (offender_id, emp_type, org_name)
           VALUES (?, ?, ?)`,
          [offenderId, type, org]
        );
      }
    }

    /** ✅ 4. Ам бүлийн гишүүд */
    if (offender.households) {
      const members = JSON.parse(offender.households);
      for (const m of members) {
        await connection.query(
          `INSERT INTO household_members (offender_id, full_name, relation, employer, address, phone)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [offenderId, m.full_name, m.relation, m.employer, m.address, m.phone]
        );
      }
    }

    /** ✅ 5. Төрөл төрөгсөд */
    if (offender.relatives) {
      const relatives = JSON.parse(offender.relatives);
      for (const r of relatives) {
        await connection.query(
          `INSERT INTO relatives (offender_id, full_name, address, phone, occupation)
           VALUES (?, ?, ?, ?, ?)`,
          [offenderId, r.full_name, r.address, r.phone, r.occupation]
        );
        
      }
    }

    /** ✅ 6. Хохирол ба төлбөрийн байдал */
    if (offender.damages) {
      const damages = JSON.parse(offender.damages);
      for (const d of damages) {
        await connection.query(
          `INSERT INTO damages (offender_id, total_amount, paid_amount)
           VALUES (?, ?, ?)`,
          [offenderId, d.total_amount || 0, d.paid_amount || 0]
        );
      }
    }
    


    /** ✅ 7. Гэмт хэргийн дэлгэрэнгүй */
    if (offender.crime_cause || offender.crime_summary) {
      await connection.query(
        `INSERT INTO crime_details (offender_id, cause, summary, main_punishment, evaded)
         VALUES (?, ?, ?, ?, ?)`,
        [
          offenderId,
          offender.crime_cause,
          offender.crime_summary,
          offender.main_punishment,
          offender.evaded ? 1 : 0,
        ]
      );
    }

    /** ✅ 8. Хамтран хэрэг үйлдэгч */
    if (offender.co_offenders) {
      const co = JSON.parse(offender.co_offenders);
      for (const c of co) {
        await connection.query(
          `INSERT INTO co_offenders (offender_id, surname, given_name, note)
           VALUES (?, ?, ?, ?)`,
          [offenderId, c.surname, c.given_name, c.note]
        );
      }
    }

    /** ✅ 9. Шүүхийн шийдвэр */
    if (offender.court_name && offender.decision_date) {
      await connection.query(
        `INSERT INTO court_sentences (offender_id, court_name, decision_date, decision_no, criminal_article, fine_amount_mnt)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          offenderId,
          offender.court_name,
          offender.decision_date,
          offender.decision_no,
          offender.criminal_article,
          offender.fine_amount_mnt || 0,
        ]
      );
    }

    /** ✅ 10. Ялын өөрчлөлт */
    if (offender.sentence_change || offender.sentence_type) {
      await connection.query(
        `INSERT INTO sentence_changes (offender_id, changed, sentence_type, note)
         VALUES (?, ?, ?, ?)`,
        [offenderId, 1, offender.sentence_type, offender.sentence_change]
      );
    }

    /** ✅ 11. Бүртгэлийн амьдралын мөчлөг */
    if (offender.opened_date) {
      await connection.query(
        `INSERT INTO offender_records (offender_id, opened_date, closed_date, executor_name)
         VALUES (?, ?, ?, ?)`,
        [
          offenderId,
          offender.opened_date,
          offender.closed_date || null,
          offender.executor_name || "",
        ]
      );
    }

    await connection.commit();
    res.json({ success: true, id: offenderId });

  } catch (err) {
    await connection.rollback();
    console.error("❌ Full Offender Insert Error:", err);
    res.status(500).json({ message: "Бүртгэл үүсгэхэд алдаа гарлаа", error: err.message });
  } finally {
    connection.release();
  }
};

/** 🔹 2. Бүх ялтангийн жагсаалт */
export const getAllOffenders = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, surname, given_name, register_no, gender, birth_date, phone, created_at 
      FROM offenders ORDER BY id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Get Offenders Error:", err);
    res.status(500).json({ message: "Жагсаалт авахад алдаа гарлаа." });
  }
};

/** 🔹 3. PDF үүсгэх */
export const printOffenderPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const filePath = await generateOffenderPDF(id);
    res.download(filePath);
  } catch (err) {
    console.error("PDF Error:", err);
    res.status(500).json({ message: "PDF үүсгэхэд алдаа гарлаа.", error: err.message });
  }
};
