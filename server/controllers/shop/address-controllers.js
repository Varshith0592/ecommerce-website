
const Address = require('../../models/Address')




const addAddress = async (req, res) => {

    try {
        const {
            userId,
            address,
            city,
            pincode,
            phone,
            notes
        } = req.body

        if (!userId || !address || !city || !pincode || !phone || !notes) {
            return res.status(400).json({
                success: false,
                message: "Invalid Data!"
            })
        }

        const newlyCreatedAddress = new Address({
            userId,
            address,
            city,
            pincode,
            phone,
            notes
        })

        await newlyCreatedAddress.save()

        res.status(201).json({
            success: true,
            data: newlyCreatedAddress
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Error while adding the address"
        })
    }
}



const fetchAllAddress = async (req, res) => {
    try {
        const { userId } = req.params
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Invalid User ID"
            })
        }

        const allAddress = await Address.find({ userId })
        res.status(200).json({
            success: true,
            data: allAddress
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Error while fetching the address"
        })
    }
}


const editAddress = async (req, res) => {
    try {

        const { userId, addressId } = req.params
        const formData = req.body

        if (!userId || !addressId) {
            return res.status(400).json({
                success: false,
                message: "Invalid User ID or Address ID"
            })
        }

        const address = await Address.findOneAndUpdate({
            _id: addressId, userId
        }, formData,
            { new: true }
        )
        if (!address) {
            return res.status(400).json({
                success: false,
                message: "Address not found"
            })
        }
        res.status(200).json({
            success: true,
            data: address
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Error while editing the address"
        })
    }
}


const deleteAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params
        if (!userId || !addressId) {
            return res.status(400).json({
                success: false,
                message: "Invalid User ID or Address ID"
            })
        }
        const address = await Address.findOneAndDelete({
            _id:addressId, userId
        })

        if (!address) {
            return res.status(400).json({
                success: false,
                message: "Address not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Address deleted successfully"
        })



    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: "Error while deleting the address"
        })
    }

}



module.exports = {
    addAddress,
    fetchAllAddress,
    editAddress,
    deleteAddress
}