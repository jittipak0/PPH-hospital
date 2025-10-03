const privacyPolicy = `โรงพยาบาลให้ความสำคัญกับความเป็นส่วนตัวของบุคลากรและผู้ป่วย ข้อมูลทั้งหมดจะถูกใช้เฉพาะเพื่อการดูแลรักษาและการบริหารงานตามที่กฎหมายกำหนด ผู้ใช้งานต้องรักษาความลับของข้อมูลผู้ป่วยและปฏิบัติตามนโยบายความปลอดภัยขององค์กรอย่างเคร่งครัด`

const termsOfUse = `ระบบสารสนเทศภายในนี้อนุญาตให้ใช้ได้เฉพาะบุคลากรของโรงพยาบาลเท่านั้น การเข้าถึงหรือเปลี่ยนแปลงข้อมูลโดยไม่ได้รับอนุญาตถือเป็นความผิดตามระเบียบและกฎหมาย หากตรวจพบการละเมิดระบบจะมีการบันทึกหลักฐานและดำเนินการตามขั้นตอนที่เหมาะสม`

const getPrivacyPolicy = (req, res) => {
  const logger = req.log?.child({ controller: 'policyController', action: 'getPrivacyPolicy' })
  logger?.debug('Serving privacy policy text')
  res.json({ policy: privacyPolicy })
}

const getTermsOfUse = (req, res) => {
  const logger = req.log?.child({ controller: 'policyController', action: 'getTermsOfUse' })
  logger?.debug('Serving terms of use text')
  res.json({ terms: termsOfUse })
}

module.exports = { getPrivacyPolicy, getTermsOfUse }
