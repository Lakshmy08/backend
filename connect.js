const express=require('express')
const mongoose=require('mongoose')
const app=express();
mongoose.connect('mongodb+srv://myUser:myUser@2001@cluster0.5nc8h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

// Middleware to parse JSON
app.use(express.json());
const studentSchema=new mongoose.Schema({
  name:{type:String,required:true},
  age:{type:Number,required:true},
  grade:{type:String,required:true},
  email:{type:String,unique:true,required:true},
});
const Student=mongoose.model('Student',studentSchema);
app.post('/students',async(req,res)=>{
  try{
    const student=new Student(req.body);
    const savedStudent=await student.save();
    res.status(201).json(savedStudent);
  }catch(err){
    res.status(400).json({error:err.message});
  }
});
app.put('/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(updatedStudent); // Use the correct variable name
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/students/:id',async(req,res)=>{
  try{
    const deletedStudent=await Student.findByIdAndDelete(req.params.id);
    if(!deletedStudent){
      return res.status(404).json({message:'Student not found'});
    }
    res.json({message:'Student deleted successfully',student:deletedStudent});
  }catch(err){
    res.status(500).json({error:err.message});
  }
});

// Example route
app.get('/', (req, res) => {
  res.send('Hello, MongoDB with Express!');
});
// Route to get all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find(); // Fetch all students from the database
    res.json(students); // Respond with the list of students in JSON format
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});