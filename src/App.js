import React, { useState } from "react";

function App() {

  // Course state
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");

  // Assignment state
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");

  // Add course
  const addCourse = () => {
    if (courseName.trim() === "") return;

    setCourses([...courses, courseName]);
    setCourseName("");
  };

  // Add assignment
  const addAssignment = () => {

    if (!title || !selectedCourse || !dueDate) return;

    const newAssignment = {
      title,
      course: selectedCourse,
      dueDate,
      priority
    };

    setAssignments([...assignments, newAssignment]);

    setTitle("");
    setSelectedCourse("");
    setDueDate("");
    setPriority("Medium");
  };

  return (
    <div style={{ padding: "20px" }}>

      <h1>Assignment Tracker</h1>

      {/* Add Course */}
      <h2>Add Course</h2>

      <input
        type="text"
        placeholder="Enter course name"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
      />

      <button onClick={addCourse}>Add</button>

      {/* Course List */}
      <h2>Courses</h2>

      <ul>
        {courses.map((course, index) => (
          <li key={index}>{course}</li>
        ))}
      </ul>

      <hr />

      {/* Add Assignment */}
      <h2>Add Assignment</h2>

      <input
        type="text"
        placeholder="Assignment Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <select
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
      >
        <option value="">Select Course</option>

        {courses.map((course, index) => (
          <option key={index} value={course}>
            {course}
          </option>
        ))}

      </select>

      <br /><br />

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <br /><br />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>

      <br /><br />

      <button onClick={addAssignment}>Add Assignment</button>

      {/* Assignment List */}
      <h2>Assignments</h2>

      <ul>
        {[...assignments]
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
          .map((a, index) => (
            <li key={index}>
              {a.title} — {a.course} — Due {a.dueDate} — {a.priority}
            </li>
          ))}
      </ul>

    </div>
  );
}

export default App;