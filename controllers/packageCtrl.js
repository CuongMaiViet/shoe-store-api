const Package = require("../models/packageModel");

const packageCtrl = {
  getAll: async (req, res) => {
    try {
      const packages = await Package.find();

      return res.status(200).json({
        success: true,
        msg: "Lấy thông tin tất cả các gói thành công",
        data: packages,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        msg: `Lấy thông tin tất cả các gói không thành công`,
        sysMsg: error.message,
      });
    }
  },

  getByCodename: async (req, res) => {
    try {
      const package = await Package.findOne({ codename: req.params.codename });

      if (!package)
        return res.status(401).json({
          success: false,
          msg: `Gói ${req.params.codename} không tồn tại`,
        });

      return res.status(200).json({
        success: true,
        msg: `Lấy thông tin gói ${req.params.codename} thành công`,
        data: package,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        msg: `Lấy thông tin của gói ${req.params.codename} không thành công`,
        sysMsg: error.message,
      });
    }
  },

  createNewPackage: async (req, res) => {
    try {
      const newPackage = new Package(req.body);
      await newPackage.save();

      return res.status(200).json({
        success: true,
        msg: `Tạo gói thành công`,
        data: newPackage,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        msg: `Tạo gói không thành công`,
        sysMsg: error.message,
      });
    }
  },
};

module.exports = packageCtrl;
