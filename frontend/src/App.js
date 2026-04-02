import { useState, useEffect } from "react";

function Login() {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ExperienceRecords")) || [];
    } catch {
      return [];
    }
  });
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedIn") === "true");
  const [fullName, setFullName] = useState(localStorage.getItem("fullName") || "");
  const [userID, setUserID] = useState(localStorage.getItem("userID") || "");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [yearsWorked, setYearsWorked] = useState("");
  const [currentJob, setCurrentJob] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [originalJobTitle, setOriginalJobTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill both fields");
      return;
    }

    console.log("Email:", email);
    console.log("Password:", password);

    const res = await fetch("http://localhost:5000/lab8/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.found) {
      const res2 = await fetch("http://localhost:5000/lab8/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: data.userID })
      });

      const experienceData = await res2.json();

      if (experienceData.found) {
        setExperience(experienceData.records);
        localStorage.setItem("ExperienceRecords", JSON.stringify(experienceData.records));
      }

      if (rememberMe) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("fullName", data.fullName);
        localStorage.setItem("userID", data.userID);
        localStorage.setItem("ExperienceRecords", JSON.stringify(experienceData.records));
      }

      console.log(experienceData);

      setLoggedIn(true);
      setFullName(data.fullName);
      setUserID(data.userID);

    }
    else {
      alert("User not found!");
    }
  };

  const refreshExperience = async () => {
    const res4 = await fetch("http://localhost:5000/lab8/experience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: userID })
    });

    const experienceData = await res4.json();
    console.log(experienceData.records);

    if (experienceData.found) {
      setExperience(experienceData.records);
      localStorage.setItem("ExperienceRecords", JSON.stringify(experienceData.records));
    }
    else {
      setExperience([]);
      localStorage.setItem("ExperienceRecords", JSON.stringify([]));
    }
  };

  const AddUserExperience = async (e) => {
    e.preventDefault();

    if (!jobTitle || !companyName || !yearsWorked) {
      alert("All Fields must be added for Add Experience");
      return;
    }

    console.log("UserID: ", userID);
    console.log("JobTitle: ", jobTitle);
    console.log("Company Name: ", companyName);
    console.log("Years worked: ", yearsWorked);
    console.log("IsCurrentJob: ", currentJob);

    const res3 = await fetch("http://localhost:5000/lab8/AddExperience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID,
        jobTitle,
        companyName,
        yearsWorked,
        currentJob
      })
    });

    const addData = await res3.json();

    if (addData.added) {
      await refreshExperience();
      setJobTitle("");
      setCompanyName("");
      setYearsWorked("");
      setCurrentJob(false);
    }
  };

  const handleEdit = (item) => {
    setOriginalJobTitle(item.JobTitle);
    setEditingId(item.ExpID);
    setEditData({
      JobTitle: item.JobTitle,
      CompanyName: item.CompanyName,
      YearsWorked: item.YearsWorked,
      IsCurrentJob: item.IsCurrentJob
    });
  };

  const handleSaveEdit = async (e) => {
    if (e && e.key && e.key !== "Enter") return;

    const res = await fetch("http://localhost:5000/lab8/updateExperience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID,
        originalJobTitle,
        jobTitle: editData.JobTitle,
        companyName: editData.CompanyName,
        yearsWorked: editData.YearsWorked,
        currentJob: editData.IsCurrentJob
      })
    });

    const response = await res.json();

    if (response.updated) {
      setEditingId(null);
      refreshExperience();
    }
  };

  const handleDelete = async (jobTitle) => {
    //  e.preventDefault();
    console.log("Deleting:", userID, jobTitle);

    const res5 = await fetch("http://localhost:5000/lab8/deleteExperience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID,
        jobTitle
      })
    });

    const response = await res5.json();

    if (response.removed) {

      alert("Experience is removed");
    }
    else {
      alert("Cant find experience!!");
    }
    refreshExperience();
  };

  if (loggedIn) {
    return (

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "-20px",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "15px",
        paddingBottom: "70px",
      }}>

        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#5811c9",
          padding: "15px 30px",
          color: "white",
          fontSize: "17px",
          fontWeight: "bold",
          zIndex: 1000,
          display: "flex",
          justifyContent: "space-between",
          boxSizing: "border-box",
          fontFamily: "Poppins, sans-serif"
        }}>
          <span>Rozgar Pakistan</span>
          <span style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            Welcome, {fullName}
            <button
              onClick={() => {
                localStorage.clear();
                setLoggedIn(false);
                setFullName("");
                setUserID("");
              }}
              style={{
                padding: "6px 16px",
                color: "white",
                fontSize: "13px",
                fontFamily: "Poppins, sans-serif",
                border: "1px solid white",
                borderRadius: "13px",
                backgroundColor: "transparent",
                cursor: "pointer"
              }}>
              LogOut
            </button>
          </span>
        </div>
        <div style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: "10px",
          paddingRight: "40px"
        }}>
          <img src="/workpic.jpg"
            style={{
              width: "350px",
              height: "350px",
              marginTop: "150px",
              objectFit: "contain",
            }} />

          <div style={{
            border: "1px solid #9412df",
            borderRadius: "16px",
            padding: "30px",
            width: "1000px",
            marginTop: "80px",
            boxShadow: "0px 1px 15px rgba(77, 33, 209, 0.49)",
            fontFamily: "Poppins, sans-serif",
          }}>

            <div>
              <span>
                <h2 style={{
                  color: "#710cdd",
                  marginBottom: "10px",
                  marginTop: "-2px",
                  fontSize: "20px"
                }}>
                  Work Experience</h2>
              </span>
            </div>

            <hr style={{
              color: "#2e7d32", marginBottom: "20px", borderTop: "1px solid #2507cf1e"
            }} />

            <div style={{
              display: "grid",
              gridTemplateColumns: "3fr 2fr 2fr 2fr 2fr",
              padding: "10px 0",
              color: "#888",
              fontSize: "14px",
              fontWeight: "bold",
              letterSpacing: "1px",
              textAlign: "center"
            }}>
              <span>JOB TITLE</span>
              <span>COMPANY</span>
              <span>YEARS</span>
              <span>STATUS</span>
              <span>Options</span>
            </div>

            {experience.map((item) => (
              <div key={item.ExpID} style={{
                display: "grid",
                gridTemplateColumns: "3fr 2fr 2fr 2fr 2fr",
                padding: "16px 0",
                borderTop: "1px solid #2507cf1e",
                alignItems: "center",
                textAlign: "center"
              }}>

                {editingId === item.ExpID ? (
                  <>
                    <input
                      value={editData.JobTitle}
                      onChange={(e) => setEditData({ ...editData, JobTitle: e.target.value })}
                      onKeyDown={handleSaveEdit}
                      style={{
                        width: "90%", padding: "10px", borderRadius: "8px",
                        border: "1px solid #9412df", fontSize: "13px",
                        outline: "none", fontFamily: "Poppins, sans-serif",
                        boxSizing: "border-box",
                        marginLeft: "20px",
                      }}
                    />
                    <input
                      value={editData.CompanyName}
                      onChange={(e) => setEditData({ ...editData, CompanyName: e.target.value })}
                      onKeyDown={handleSaveEdit}
                      style={{
                        width: "90%", padding: "10px", borderRadius: "8px",
                        border: "1px solid #9412df", fontSize: "13px",
                        outline: "none", fontFamily: "Poppins, sans-serif",
                        boxSizing: "border-box",
                        marginLeft: "20px",
                      }}
                    />
                    <input
                      type="number"
                      value={editData.YearsWorked}
                      onChange={(e) => setEditData({ ...editData, YearsWorked: e.target.value })}
                      onKeyDown={handleSaveEdit}
                      style={{
                        width: "50%", padding: "10px", borderRadius: "8px",
                        border: "1px solid #9412df", fontSize: "13px",
                        outline: "none", fontFamily: "Poppins, sans-serif",
                        boxSizing: "border-box",
                        marginLeft: "60px",
                      }}
                    />
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", justifyContent: "center" }}>
                      <input
                        type="checkbox"
                        checked={editData.IsCurrentJob}
                        onChange={(e) => setEditData({ ...editData, IsCurrentJob: e.target.checked })}
                        style={{ width: "16px", height: "16px", accentColor: "#9412df" }}
                      />
                      <label style={{ fontSize: "12px", color: "#9412df" }}>Currently Working?</label>
                    </div>
                  </>
                ) : (
                  <>
                    <span style={{ fontWeight: "bold" }}>{item.JobTitle}</span>
                    <span style={{ color: "#555" }}>{item.CompanyName}</span>
                    <span style={{ color: "#555" }}>{item.YearsWorked} {item.YearsWorked === 1 ? "year" : "years"}</span>
                    <span style={{
                      backgroundColor: item.IsCurrentJob ? "#e8f5e9" : "#f0f0f0",
                      color: item.IsCurrentJob ? "#2e7d32" : "#888",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      display: "inline-block",
                      width: "fit-content",
                      justifySelf: "center"
                    }}>
                      {item.IsCurrentJob ? "Current" : "Past"}
                    </span>
                  </>
                )}

                <span style={{ display: "flex", flexDirection: "row", gap: "5px", justifySelf: "center", alignItems: "center" }}>
                  {editingId === item.ExpID ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        style={{
                          padding: "6px 12px", color: "white", fontSize: "13px",
                          fontFamily: "Poppins, sans-serif", border: "none",
                          borderRadius: "8px", backgroundColor: "#9412df", cursor: "pointer"
                        }}>
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        style={{
                          padding: "6px 12px", color: "white", fontSize: "13px",
                          fontFamily: "Poppins, sans-serif", border: "none",
                          borderRadius: "8px", backgroundColor: "#888", cursor: "pointer"
                        }}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(item)}
                        style={{
                          padding: "6px 12px", color: "white", fontSize: "13px",
                          fontFamily: "Poppins, sans-serif", border: "none",
                          borderRadius: "8px", backgroundColor: "#f0a500", cursor: "pointer"
                        }}>
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(item.JobTitle)}
                        style={{
                          padding: "6px 12px", color: "white", fontSize: "13px",
                          fontFamily: "Poppins, sans-serif", border: "none",
                          borderRadius: "8px", backgroundColor: "#e53935", cursor: "pointer"
                        }}>
                        Delete
                      </button>
                    </>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          border: "1px solid #9412df",
          borderRadius: "16px",
          padding: "30px",
          width: "1150px",
          marginTop: "80px",
          boxShadow: "0px 1px 15px rgba(77, 33, 209, 0.49)",
          fontFamily: "Poppins, sans-serif",
        }}>


          <h2 style={{
            color: "#710cdd",
            marginBottom: "10px",
            marginTop: "-2px",
            fontSize: "20px"
          }}>
            Add Experience</h2>

          <hr style={{
            color: "#2e7d32", marginBottom: "20px", borderTop: "1px solid #2507cf1e"
          }} />

          <div style={
            {
              display: "flex",
              flexDirection: "row",
              gap: "10px",
            }
          }>
            <input type="text"
              placeholder="Enter Jobtitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              style={{
                width: "30%",
                boxSizing: "border-box",
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "14px",
                outline: "none"
              }}
            />

            <input type="text"
              placeholder="Enter Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              style={{
                width: "30%",
                boxSizing: "border-box",
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "14px",
                outline: "none"
              }}
            />

            <input type="number"
              placeholder="Enter Years Worked"
              value={yearsWorked}
              onChange={(e) => setYearsWorked(e.target.value)}
              style={{
                width: "30%",
                boxSizing: "border-box",
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "14px",
                outline: "none"
              }}
            />

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox"
                checked={currentJob}
                onChange={(e) => setCurrentJob(e.target.checked)}
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "#9412df",
                  cursor: "pointer"
                }}
              />
              <label style={{
                color: "#9412df",
                fontFamily: "Poppins, sans-serif",
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer"
              }}>
                Currently Working Here?
              </label>
            </div>

          </div>

          <div style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            paddingTop: "10px"
          }}>
            <button onClick={AddUserExperience} style={{
              width: "30%",
              padding: "6px",
              color: "White",
              fontSize: "17px",
              boxShadow: "0px 1px 4px rgba(77, 33, 209, 0.49)",
              fontFamily: "Poppins, sans-serif",
              border: "1px solid #9412df",
              borderRadius: "13px",
              backgroundColor: "#9412df",
            }}>
              Add
            </button >
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundImage: "url('/art2.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    }}>

      <div style={{
        border: "1px solid #9a5cbc",
        borderRadius: "30px",
        padding: "40px",
        width: "450px",
        boxShadow: "0px 4px 50px rgba(33, 13, 45, 0.81)",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundImage: "url('/logicback.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>

        <h2 style={{
          fontSize: "30px",
          color: "rgb(255, 255, 255)",
          margin: "0 0 20px 0"
        }}>
          Rozgar Pakistan
        </h2>

        <img
          src="/login-person-image.jpg"
          alt="Logo"
          style={{
            width: "270px",
            height: "270px",
            borderRadius: "50%",
            marginBottom: "30px"
          }}
        />

        <div style={{ flexGrow: 1 }} />

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              boxSizing: "border-box",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
              outline: "none"
            }}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              boxSizing: "border-box",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
              outline: "none"
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "15px" }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: "#5811c9", width: "16px", height: "16px", cursor: "pointer" }}
            />
            <label style={{ fontSize: "14px", color: "#555", cursor: "pointer" }}>
              Remember Me
            </label>
          </div>

          <button type="submit" style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#5811c9",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            letterSpacing: "1px",
            boxShadow: "0px 4px 10px rgba(222, 227, 227, 0.2)",
          }}>
            Login
          </button>
        </form>

      </div>
    </div>
  );
}

export default Login;