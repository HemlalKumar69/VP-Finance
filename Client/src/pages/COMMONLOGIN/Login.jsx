import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { loginUser } from "../../redux/feature/auth/authThunx";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  useEffect(() => {
    if (user) {
      toast.success(`Welcome ${user.username} (${user.role}) 🎉`);

      if (user.role === "Telecaller") {
        navigate("/telecaller/dashboard");
      } else if (user.role === "Telemarketer") {
        navigate("/telemarketer/dashboard");
      } else if (user.role === "OA") {
        navigate("/");
      } else if (user.role === "OE") {
        navigate("/oe/dashboard");
      } else if (user.role === "HR") {
        navigate("/dashboard");
      }
    }
    if (error) {
      toast.error(error);
    }
  }, [user, error, navigate]);

  // Handle test login for HR specifically
  const handleHRTestLogin = () => {
    // Create a test HR user object
    const testUser = {
      username: "HR Manager",
      email: "hr@test.com",
      role: "HR",
      token: "test-token-hr"
    };
    
    // Save to localStorage
    localStorage.setItem("token", testUser.token);
    localStorage.setItem("user", JSON.stringify(testUser));
    
    // Dispatch success and navigate
    toast.success("Logged in as HR Manager");
    navigate("/dashboard");
  };

  return (
    <div className="container">
      <form className="card" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "5px" }}>
          <button 
            type="button" 
            onClick={handleHRTestLogin}
            style={{ 
              background: "#4f46e5",
              color: "white",
              fontSize: "16px",
              border: "none",
              cursor: "pointer",
              padding: "11px 12px",
              borderRadius: "6px"
            }}
          >
            Login as HR
          </button>
        </div>
      </form>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: "Segoe UI", sans-serif;
        }

        .card {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }

        h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #333;
          font-size: 24px;
        }

        input {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          box-sizing: border-box;
        }

        input:focus {
          outline: none;
          border-color: #667eea;
        }

        button {
          width: 100%;
          padding: 12px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          margin-bottom: 20px;
        }

        button:hover {
          background: #5a67d8;
        }

        button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .register-section {
          text-align: center;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }

        .register-section p {
          margin-bottom: 15px;
          color: #666;
          font-size: 14px;
        }

        .register-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .register-link {
          display: block;
          padding: 8px 12px;
          background: #f8f9ff;
          color: #667eea;
          text-decoration: none;
          border-radius: 6px;
          font-size: 13px;
          border: 1px solid #e2e8f0;
          transition: all 0.2s;
        }

        .register-link:hover {
          background: #667eea;
          color: white;
          transform: translateY(-1px);
        }

        @media (max-width: 480px) {
          .card {
            margin: 20px;
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
