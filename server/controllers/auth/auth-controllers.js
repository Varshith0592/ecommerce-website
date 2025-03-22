const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require("../../models/User")



//Register
const registerUser = async (req, res) => {
    const { userName, email, password } = req.body;


    try {
        const checkUser = await User.findOne({ email });
        if (checkUser) {
            return res.json({
                success: false,
                message: "User already exists"
            })
        }
        const hashPassword = await bcryptjs.hash(password, 12)
        const newUser = new User({
            userName, email,
            password: hashPassword
        })

        await newUser.save()
        res.status(200).json({
            success: true,
            message: "Registration successful"
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured'
        })
    }
}


//Login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {

        const checkUser = await User.findOne({ email });
        if (!checkUser) {
            return res.json({
                success: false,
                message: "User does not exist!"
            })
        }
        const isValidPassword = await bcryptjs.compare(password, checkUser.password);
        if (!isValidPassword) {
            return res.json({
                success: false,
                message: "Invalid password"
            })
        }
        const token = await jwt.sign({
            id: checkUser._id,
            role: checkUser.role,
            email: checkUser.email,
            userName: checkUser.userName
        }, 'CLIENT_SECRET_KEY', { expiresIn: '1h' })

        // res.cookie('token',
        //     token,
        //     {httpOnly:true,secure:true}).json({
        //         success:true,
        //         message:"Logged in successfully",
        //         user:{
        //             email: checkUser.email,
        //             role: checkUser.role,
        //             id: checkUser._id,
        //             userName:checkUser.userName
        //         }
        //     }) 
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            token,
            user: {
                email: checkUser.email,
                role: checkUser.role,
                id: checkUser._id,
                userName: checkUser.userName
            }
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured'
        })
    }
}


//Logout

const logoutUser = async (req, res) => {
    res.clearCookie('token').json({
        success: true,
        message: 'Logged out successfully'
    })
}


//Auth Middleware

// const authMiddleware = async (req, res, next) => {
//     const token = req.cookies.token;
//     if (!token) {
//         return res.status(401).json({
//             success: false,
//             message: "Unauthorized user"
//         })
//     }
//     try {
//         const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY')
//         req.user = decoded
//         next()
//     } catch (e) {
//         console.log(e)
//         res.status(401).json({
//             success: 'false',
//             message: 'Invalid token'
//         })
//     }
// }

const authMiddleware = async (req, res, next) => {
    const authHeader=req.headers['authorization']
    const token=authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user"
        })
    }
    try {
        const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY')
        req.user = decoded
        next()
    } catch (e) {
        console.log(e)
        res.status(401).json({
            success: 'false',
            message: 'Invalid token'
        })
    }
}






module.exports = { registerUser, loginUser, logoutUser, authMiddleware }