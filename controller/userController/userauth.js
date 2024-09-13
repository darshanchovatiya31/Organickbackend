const User = require("../../model/user");
const bcrypt = require("bcryptjs");
const { ErrorHandler } = require("../../middleware/errorHandler");
const { StatusCodes } = require("http-status-codes");
const nodemailer = require("nodemailer");

//node mailer
const transpoter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: "darshanchovatiya30@gmail.com",
    pass: "ezgv skmf szna bjzt",
  },
});

exports.postUserSignUp = async (req, res, next) => {
  try {
    const { username, email, password, number } = req.body;

    if (!username || !email || !password || !number) {
      return next(
        new ErrorHandler("All Fileds are requried", StatusCodes.BAD_REQUEST)
      );
    }

    const user = await User.findOne({ email: email });
    if (user) {
      return next(
        new ErrorHandler("Email Already exist", StatusCodes.UNAUTHORIZED)
      );
    }
    //node mailer
    await transpoter.sendMail({
      from: "darshanchovatiya30@gmail.com",
      to: email,
      subject: "shop signup",
      text: "welcome to signup",
      html: `
                <h1>welcome ${username}</h1>
                <img src="https://cdn.slidesharecdn.com/ss_thumbnails/mycreditseminar-160609031754-thumbnail.jpg?width=640&height=640&fit=bounds" width="200px" height="200px"/>
                `,
    });
    const hasspasword = await bcrypt.hash(password, 10);

    const result = await User.create({
      username,
      email,
      password: hasspasword,
      number,
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "USER SIGNUP SUCSSEFULYY",
      data: result,
    });
  } catch (error) {
    return next(new ErrorHandler(error, StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

exports.postUserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All are requried",
      });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message: "user not found",
      });
    }

    const passcomm = await bcrypt.compare(password, user.password);
    if (!passcomm) {
      return res.status(400).json({
        message: "password not match",
      });
    }

    return res.status(201).json({
      success: true,
      message: "USER LOGIN SUCSSEFULYY",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "server problem",
      error,
    });
  }
};
