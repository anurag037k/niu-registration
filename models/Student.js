const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    serialNumber: { type: String, required: true },
    studentName: { type: String, required: true },
    fathersName: { type: String, required: true },
    prfNo: { type: String, required: true },
    personalEmail: { type: String, required: true },
    personalMobile: { type: String, required: true },
    batch: { type: String, required: true },
    course: { type: String, required: true },
    school: { type: String, required: true },
    program: { type: String, required: true },
    semester: { type: String, required: true },
    registrationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);