const asyncHandler = require("express-async-handler")
const Contact = require("../models/contactModel")
//@Description Get all contacts
//@route GET /api/contacts
//@access private

const getContacts = asyncHandler(async(req,res) => {
    const contacts = await Contact.find({ user_id: req.user.id});
    res.status(200).json(contacts)
 });

//@Description Create new contacts
//@route POST /api/contacts
//@access private
 const createContact = asyncHandler(async(req,res) => {
    console.log("The request body is ", req.body);
    const{name,email,phone} = req.body;
    if(!name){
        res.status(400);
        throw new Error("Username should be there");
    }
    else if(!email){
      res.status(400);
      throw new Error("Email should be there");
  }
   else if(!phone){
   res.status(400);
   throw new Error("Phone number should be there");
}
    const contact = await Contact.create({name,email,phone, user_id: req.user.id})
    res.status(201).json({contact})
})

//@Description Get contacts
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async(req,res) => {
    const contact = await Contact.findById(req.params.id);
     if(!contact){
        res.status(404);
        throw new Error("Contact not found")
     }
    res.status(200).json(contact)
 })

 const getContactByName = asyncHandler(async(req,res) => {
   const contactByName = await Contact.find({name:req.params.name})
   console.log(contactByName)
    if(!contactByName){
       res.status(404);
       throw new Error("Contact not found")
    }
    
   res.status(200).json(contactByName)
})
 

//@DescriptionDelete contact
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async(req,res) => {
    const contact = await Contact.findById(req.params.id);
     if(!contact){
        res.status(404);
        throw new Error("Contact not found")
     }

     if(contact.user_id.toString() !== req.user.id){
      res.status(403);
      throw new Error("User don't have permission to update other user contacts")
     }
     await Contact.deleteOne({_id: req.params.id})
     //console.log(contact)
    res.status(200).json(contact)
 })


//@Description Update contact
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async(req,res) => {
    const contact = await Contact.findById(req.params.id);
     if(!contact){
        res.status(404);
        throw new Error("Contact not found")
     }

     if(contact.user_id.toString() !== req.user.id){
      res.status(403);
      throw new Error("User don't have permission to update other user contacts")
     }
     const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
     )
res.status(200).json(updatedContact)
 })
 

 module.exports = {getContacts, createContact, getContact,deleteContact,updateContact,getContactByName}