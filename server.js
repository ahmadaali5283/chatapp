import express from "express";
const app = express();
app.use(express.json());
let courses = [
  { id: 1, title: "Database Systems", instructor: "Dr Kamran", creditHours: 3 },
  { id: 2, title: "Operating Systems", instructor: "Dr Sara", creditHours: 4 }
];
const isValidCourse = ({ title, instructor, creditHours } = {}) =>
  typeof title === "string" &&
  title.trim() &&
  typeof instructor === "string" &&
  instructor.trim() &&
  Number.isInteger(creditHours) &&
  creditHours >= 1 &&
  creditHours <= 4;
app.post("/courses", (req, res) => {
  if (!isValidCourse(req.body)) {
    return res.status(400).json({ error: "Invalid course data" });
  }
  const nextId = courses.reduce((maxId, c) => Math.max(maxId, c.id), 0) + 1;
  const { title, instructor, creditHours } = req.body;
  const newCourse = { id: nextId, title: title.trim(), instructor: instructor.trim(), creditHours };

  courses.push(newCourse);
  return res.status(201).json(newCourse);
});
app.put("/courses/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const courseIndex = courses.findIndex((course) => course.id === id);

  if (courseIndex === -1) {
    return res.status(404).json({ error: "Course not found" });
  }

  const { title, instructor, creditHours } = req.body;
  const updatedCourse = { id, title, instructor, creditHours };
  courses[courseIndex] = updatedCourse;

  if (req.query.notify === "true") {
    console.log("Instructor notified");
  }

  return res.json(updatedCourse);
});
app.delete("/courses/:id", (req, res) => {
  if (req.headers.role !== "admin") {
    return res.status(403).json({ error: "Only admin can delete courses" });
  }

  const id = parseInt(req.params.id, 10);
  const courseIndex = courses.findIndex((course) => course.id === id);

  if (courseIndex === -1) {
    return res.status(404).json({ error: "Course not found" });
  }

  courses.splice(courseIndex, 1);
  return res.json({ message: "Course deleted" });
});
app.delete("/courses", (req, res) => {
  const ids = Array.isArray(req.body?.ids) ? req.body.ids : null;
  if (!ids || !ids.every(Number.isInteger)) return res.status(400).json({ error: "Invalid ids list" });
  const remove = new Set(ids);
  courses = courses.filter((c) => !remove.has(c.id));
  return res.json({ message: "Selected courses deleted" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
