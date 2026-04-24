import React, { useState, useEffect } from "react";

function App() {

  // ================================
  // STATE (PERSISTENT)
  // ================================

  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem("assignments");
    return saved ? JSON.parse(saved) : [];
  });

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem("courses");
    return saved ? JSON.parse(saved) : [];
  });

  const [courseName, setCourseName] = useState("");
  const [title, setTitle] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [weight, setWeight] = useState("");
  const [editingId, setEditingId] = useState(null);

  // ================================
  // SAVE DATA
  // ================================

  useEffect(() => {
    localStorage.setItem("assignments", JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

  // ================================
  // PRIORITY FROM WEIGHT
  // ================================

  const getPriorityFromWeight = (weight) => {
  const w = parseInt(weight);

  if (w >= 40) return "High";
  if (w >= 15) return "Medium";
  return "Low";
};

  // ================================
  // LOCAL DATE PARSER (FIXES TIMEZONE BUG)
  // ================================

  const parseLocalDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day);
  };

  // ================================
  // ADD / UPDATE ASSIGNMENT
  // ================================

  const addAssignment = () => {
    if (!title || !selectedCourse || !dueDate || !weight) return;

    const priority = getPriorityFromWeight(weight);

    if (editingId) {
      setAssignments(assignments.map(a =>
        a.id === editingId
          ? { ...a, title, course: selectedCourse, dueDate, weight, priority }
          : a
      ));
      setEditingId(null);
    } else {
      const newAssignment = {
        id: Date.now(),
        title,
        course: selectedCourse,
        dueDate,
        weight,
        priority,
        completed: false
      };
      setAssignments([...assignments, newAssignment]);
    }

    setTitle("");
    setSelectedCourse("");
    setDueDate("");
    setWeight("");
  };

  // ================================
  // EDIT
  // ================================

  const editAssignment = (a) => {
    setTitle(a.title);
    setSelectedCourse(a.course);
    setDueDate(a.dueDate);
    setWeight(a.weight);
    setEditingId(a.id);
  };

  // ================================
  // DELETE ASSIGNMENT
  // ================================

  const deleteAssignment = (id) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  // ================================
  // DELETE COURSE
  // ================================

  const deleteCourse = (courseName) => {
    if (!window.confirm("Delete this course and all its assignments?")) return;

    setCourses(courses.filter(c => c !== courseName));
    setAssignments(assignments.filter(a => a.course !== courseName));
  };

  // ================================
  // COMPLETE
  // ================================

  const toggleComplete = (id) => {
    setAssignments(assignments.map(a =>
      a.id === id ? { ...a, completed: !a.completed } : a
    ));
  };

  // ================================
  // DATE LOGIC (FIXED PROPERLY)
  // ================================

  const getDaysLeft = (dateString) => {
    const today = new Date();
    const due = parseLocalDate(dateString);

    today.setHours(0,0,0,0);
    due.setHours(0,0,0,0);

    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diff < 0) return "Overdue";
    if (diff === 0) return "Due today";
    return `${diff} days left`;
  };

  // ================================
  // DASHBOARD
  // ================================

  const total = assignments.length;
  const completed = assignments.filter(a => a.completed).length;

  const overdue = assignments.filter(a => {
    const today = new Date();
    const due = parseLocalDate(a.dueDate);

    today.setHours(0,0,0,0);
    due.setHours(0,0,0,0);

    return due < today && !a.completed;
  }).length;

  // ================================
  // COLORS
  // ================================

  const getPriorityColor = (priority) => {
    if (priority === "High") return "#ef4444";
    if (priority === "Medium") return "#f59e0b";
    return "#22c55e";
  };

  const getStatusColor = (a) => {
    if (a.completed) return "#9ca3af";

    const today = new Date();
    const due = parseLocalDate(a.dueDate);

    today.setHours(0,0,0,0);
    due.setHours(0,0,0,0);

    if (due < today) return "#ef4444";
    if (due.getTime() === today.getTime()) return "#f59e0b";

    return "#111827";
  };

  const getDaysColor = (text) => {
    if (text === "Overdue") return "#ef4444";
    if (text === "Due today") return "#f59e0b";
    return "#22c55e";
  };

  // ================================
  // UI
  // ================================

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh", padding: "20px", fontFamily: "Arial" }}>

      <h1 style={{ textAlign: "center", marginBottom: "20px", fontWeight: "600" }}>
        Assignment Tracker Dashboard
      </h1>

      {/* DASHBOARD */}
      <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginBottom: "30px" }}>
        <div style={cardStyle("#e5e7eb")}><h3>Total</h3><p>{total}</p></div>
        <div style={cardStyle("#d1fae5")}><h3>Completed</h3><p>{completed}</p></div>
        <div style={cardStyle("#fee2e2")}><h3>Overdue</h3><p>{overdue}</p></div>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>

        {/* COURSES */}
        <div style={panelStyle}>
          <h2>Courses</h2>

          <input
            type="text"
            placeholder="Enter course"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            style={inputStyle}
          />
          <button onClick={() => {
            if (!courseName.trim()) return;
            setCourses([...courses, courseName]);
            setCourseName("");
          }} style={buttonStyle}>Add Course</button>

          <ul>
            {courses.map((c, i) => (
              <li key={i} style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                <span>{c}</span>
                <button onClick={() => deleteCourse(c)} style={deleteBtn}>Remove</button>
              </li>
            ))}
          </ul>
        </div>

        {/* ASSIGNMENTS */}
        <div style={{ flex: 2 }}>

          <div style={panelStyle}>
            <h2>{editingId ? "Edit Assignment" : "Add Assignment"}</h2>

            <input placeholder="Assignment Title"
              value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />

            <select value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)} style={inputStyle}>
              <option value="">Select Course</option>
              {courses.map((c, i) => <option key={i}>{c}</option>)}
            </select>

            <input type="date"
              value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={inputStyle} />

            <input type="number"
              placeholder="Weight (%)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              style={inputStyle}
            />

            <button onClick={addAssignment} style={buttonStyle}>
              {editingId ? "Update Assignment" : "+ Add Assignment"}
            </button>
          </div>

          <div style={{ marginTop: "20px" }}>
            <h2>Assignments</h2>

            {assignments.length === 0 ? (
              <p style={{ textAlign: "center", color: "#6b7280" }}>
                No assignments yet.
              </p>
            ) : (
              assignments
                .sort((a, b) => parseLocalDate(a.dueDate) - parseLocalDate(b.dueDate))
                .map(a => {
                  const daysText = getDaysLeft(a.dueDate);

                  return (
                    <div key={a.id} style={assignmentCard}>

                      <input type="checkbox"
                        checked={a.completed}
                        onChange={() => toggleComplete(a.id)} />

                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          margin: 0,
                          textDecoration: a.completed ? "line-through" : "none",
                          color: getStatusColor(a)
                        }}>
                          {a.title}
                        </h3>

                        <p>{a.course}</p>

                        <p style={{
                          fontSize: "12px",
                          fontWeight: "500",
                          color: a.completed ? "#9ca3af" : getDaysColor(daysText)
                        }}>
                          {a.completed ? "Completed" : daysText}
                        </p>

                        <p style={{ fontSize: "12px" }}>
                          Weight: {a.weight}% | Priority: {a.priority}
                        </p>
                      </div>

                      <span style={{
                        background: getPriorityColor(a.priority),
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "10px",
                        fontSize: "12px"
                      }}>
                        {a.priority}
                      </span>

                      <button onClick={() => editAssignment(a)} style={editBtn}>
                        Edit
                      </button>

                      <button onClick={() => deleteAssignment(a.id)} style={deleteBtn}>
                        Remove
                      </button>

                    </div>
                  );
                })
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

/* STYLES */

const cardStyle = (bg) => ({
  background: bg,
  padding: "15px",
  borderRadius: "10px",
  width: "120px",
  textAlign: "center"
});

const panelStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  flex: 1
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  borderRadius: "6px"
};

const buttonStyle = {
  background: "#2563eb",
  color: "white",
  padding: "10px",
  border: "none",
  borderRadius: "6px",
  width: "100%"
};

const editBtn = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "6px",
  borderRadius: "6px",
  marginLeft: "5px"
};

const deleteBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "6px",
  borderRadius: "6px",
  marginLeft: "5px"
};

const assignmentCard = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  background: "white",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "10px"
};

export default App;
