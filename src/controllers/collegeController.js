const collegeModel = require('../models/collegeModel')
const internModel = require('../models/internModel')

const createCollege = async function(req,res){

    try{
        
        const data = req.body
        const { name, fullName, logoLink } = data ;
        const validName = /^[A-Za-z]+$/ ;

        if(Object.keys(data).length == 0 ){
            res.status(400).send({status: false, message: "you forget to fill all of these fields"})
            return
        }


        if(!name){
            res.status(400).send({status: false, message: "Oops! you forget to enter name of your College"})
            return
        }

        if(typeof name !=="string" || name.trim().length == 0){
            res.status(400).send({status: false, message: "Enter the college name properly "})
            return
        }
        if(!validName.test(name)){
            res.status(400).send({status: false, message: " Use Characters Only !!"})
            return
        }
        if(!fullName){
            res.status(400).send({status: false, message: "Oops! you forget to enter Full Name of your College"})
            return
        }

        if(typeof fullName !=="string" || fullName.trim().length == 0){
            res.status(400).send({status: false, message: "Enter the college fullName properly "})
            return
        }

        if(!logoLink){
            res.status(400).send({status: false, message: "Oops! you forget to enter LOGO URL of your College"})
            return
        }


         if(typeof logoLink !=="string" || logoLink.trim().length == 0){
            res.status(400).send({status: false, message: "Make sure the LOGO URL is correct or not??"})
            return
        }

        const collegeData = await collegeModel.create(data)
        return res.status(201).send({status: true, data: collegeData})


    }
    catch(error){

        return res.status(500).send({status: false, message: error.message})

    }
}

// ***********************************************************************************************


        const getCollegeDetails = async function(req, res){

            try{
                let data =req.query
                if(Object.keys(data).length == 0 ){
                    res.status(400).send({status: false, message: "Query cannot be Empty"})
                    return
                }

                let collegeName = req.query.collegeName;
                const collegeData = await collegeModel.findOne({name: collegeName , isDeleted: false})
                // console.log(collegeData)

                if (!collegeData)return res.status(400).send({ status: false, message: "enter a valid college name" })
                
                const collegeDetails = {
                    name: collegeData.name,
                    fullName: collegeData.fullName,
                    logoLink: collegeData.logoLink
                }

                // const collegeId = collegeData._id
                const getInterns = await internModel.find({collegeId :collegeData._id}).select({_id: 1,name :1 ,email:1 , mobile :1 })
                // console.log(getInterns)
        
                if(getInterns.length!=0){
                    collegeDetails.interns = getInterns
                    res.status(200).send({status: true , data: collegeDetails})
                }

                if(getInterns.length == 0)return res.status(400).send({ status: false, message: "No interns found" })
            }
            catch (err) {
                res.status(500).send({ status:false , error: err.message})
            }
        }

module.exports.getCollegeDetails = getCollegeDetails
module.exports.createCollege = createCollege