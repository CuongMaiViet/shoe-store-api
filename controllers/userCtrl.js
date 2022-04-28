const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const toCapitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const getFullNameCapitalize = (str) => {
  let fullname = "";
  const splitArray = str.split(" ");
  splitArray.forEach((e) => {
    fullname += `${toCapitalize(e)} `;
  });

  return fullname.trim();
};

const getFirstName = (str) => {
  const splitName = getFullNameCapitalize(str).split(" ");
  return splitName[0];
};

const getMiddleName = (str) => {
  let middlename = "";
  const splitName = getFullNameCapitalize(str).split(" ");
  for (let i = 1; i < splitName.length - 1; i++) {
    middlename += `${splitName[i]} `;
  }
  return middlename.trim();
};

const getLastName = (str) => {
  const splitName = getFullNameCapitalize(str).split(" ");
  const index = splitName.length - 1;
  return splitName[index];
};

const userCtrl = {
  register: async (req, res) => {
    try {
      const { email, password, phone, fullName, dob, gender } = req.body;
      getMiddleName(fullName);
      // for (const key in req.body) {
      //   if (!key) {
      //     errors.push(`Vui lòng cung cấp ${key}.`);
      //   }
      // }

      const user = await User.findOne({ phone });
      if (user)
        return res.status(401).json({
          success: false,
          errCode: "SDT-F",
          msg: "Số điện thoại đã được đăng ký. Vui lòng sử dụng số khác.",
        });
      // errors.push("Số điện thoại đã được đăng ký. Vui lòng sử dụng số khác.");

      if (password === undefined || password === null)
        return res.status(401).json({
          success: false,
          errCode: "MK-F",
          msg: "Vui lòng nhập mật khẩu.",
        });
      // errors.push("Vui lòng nhập mật khẩu " + password);

      // if (errors.length > 0) {
      //   return res.status(401).json({
      //     success: false,
      //     msg: errors,
      //   });
      // }
      const pronoun = gender === "nam" ? "anh" : "chị";
      const pwHash = await bcrypt.hash(password, 10);

      const newUser = new User({
        email,
        password: pwHash,
        phone,
        fullName: getFullNameCapitalize(fullName),
        firstName: getFirstName(fullName),
        middleName: getMiddleName(fullName),
        lastName: getLastName(fullName),
        dob,
        gender,
        pronoun: pronoun,
      });

      await newUser.save();

      return res.status(200).json({
        success: true,
        msg: `Chúc mừng ${pronoun} ${getLastName(
          fullName
        )} đã tạo tài khoản thành công.`,
        data: newUser,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        errCode: "TTT-F",
        msg: `Tạo tài khoản không thành công.`,
        sysMsg: error.message,
      });
    }
  },

  verify: async (req, res) => {
    try {
      const { verify } = req.params;
      let user;

      const checkIfNumberOnly = isNaN(verify);

      if (checkIfNumberOnly) user = await User.findOne({ email: verify });
      else user = await User.findOne({ phone: verify });

      if (!user)
        return res.status(401).json({
          success: false,
          errCode: "KH-KTT",
          msg: `Khách hàng có ${
            checkIfNumberOnly ? "email" : "số điện thoại"
          } ${verify} không tồn tại`,
        });

      return res.status(200).json({
        success: true,
        msg: `${user.pronoun} ${user.lastName} đúng không ạ?`,
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        errCode: "XT-F",
        msg: `Xác thực không thành công.`,
        sysMsg: error.message,
      });
    }
  },
};

module.exports = userCtrl;
