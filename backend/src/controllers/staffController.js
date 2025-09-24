const announcementModel = require('../models/announcementModel');
const { sanitizeValue } = require('../utils/sanitizer');

const getAnnouncements = (req, res) => {
  const announcements = announcementModel.listAnnouncements().map((announcement) =>
    sanitizeValue({
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      createdAt: announcement.createdAt,
    })
  );
  return res.json({ announcements });
};

module.exports = {
  getAnnouncements,
};
