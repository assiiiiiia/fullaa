<template>
  <header class="header">
    <!-- Search Bar -->
    <div class="search-bar">
      <input placeholder="Search..." type="text" class="search-input">
        <button type="submit">Go</button>
    </div>

    <!-- Icons and Profile -->
    <div class="icons-and-profile d-flex">
      <!-- Notification Icon (visible only on medium and larger screens) -->
      <button class="icon-btn d-none d-md-block">
        <i class="fas fa-bell"></i>
      </button>

      <!-- Light/Dark Mode Toggle Icon (visible only on medium and larger screens) -->
      <div class="icon-btn ">
              <i 
                class="fas" 
                :class="darkMode ? 'fa-sun' : 'fa-moon'" 
                @click="toggleDarkMode"
                style="cursor: pointer; font-size: 20px;"
              ></i>
            </div>

      <!-- Settings Icon (visible only on medium and larger screens) -->
      <button class="icon-btn d-none d-md-block me-5">
        <i class="fas fa-cog"></i>
      </button>

      <!-- User Profile (always visible) -->
      <div class="profile d-flex">
        <img
          :src="require('@/assets/user.jpg')"
          alt="User"
          class="profile-img"
        />
        <div class="profile-info">
          <span class="profile-name">{{ capitalizedName }}</span>
        </div>

      </div>
    </div>
  </header>
</template>

<script>
  import axios from "axios"; 
export default {

  name: "HeaderView",
  data() {
    return {
      darkMode: false,
      userName: "",
       // Track dark mode state
    };
  },
  created() {
    axios
      .get("http://localhost:3000/api/user", { withCredentials: true })
      .then((response) => {
        this.userName = response.data.userName; // Set the user's name
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données utilisateur :", error);
      });
  
    // Check if dark mode is already set in localStorage
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      this.darkMode = true;
      document.body.classList.add("dark-mode");
    }
  },
  computed: {
  capitalizedName() {
    if (!this.userName) return "";
    return this.userName.charAt(0).toUpperCase() + this.userName.slice(1);
  },
},

  
    // Fetch user data from the backend
    
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      if (this.darkMode) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("darkMode", "true");
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("darkMode", "false");
      }
    },
  },
  // Import axios to make API requests



 mounted() {
  // Make an API call to fetch the user data from the backend when the component is mounted
  axios.get("http://localhost:3000/api/user", { withCredentials: true })
    .then(response => {
      if (response.data.userName) {
        this.userName = response.data.userName; // Assign the fetched name to userName
      } else {
        console.error('User not authenticated');
      }
    })
    .catch(error => {
      console.error("Error fetching user data:", error);
    });
}

};

</script>

<style scoped>
/* Header Container */
.dark-mode .search-bar{
background-color: #3f3f3f;
border-radius: 20px;
}
.dark-mode .search-input{
  color: #c3c3c3;

}
.header {
  display: flex;
  justify-content: space-between; /* Space between search bar and other elements */
  align-items: center; /* Center vertically */
  padding: 1rem;
  position: relative; /* Allows fine positioning */
}

/* Centered Search Bar */
.search-bar {
  display: flex;
  justify-content: flex-start; /* Align search bar to the left */
  position: relative; /* Remove absolute positioning */
  left: 20%; /* Remove unnecessary offset */
  width: 50%; /* Adjust width of the search bar container */
  transition: 0.4s;
}

/* Search Input */
.search-input {
  width: 100%;  
  border-radius: 5px;
  outline: none;
  padding: 10px;
  padding-left: 50px;
  border: none;
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* Icons and Profile Section */
.icons-and-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto; /* Push to the right side */
}
.dark-mode .icon-btn {
  color:  hsl(268, 75%, 67%);
}
.dark-mode .profile-name{
  color:  hsl(268, 75%, 67%);
}
/* Icon Buttons */
.icon-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #491784;
  transition: transform 0.2s ease;
}
.icon-btn:hover {
  color: hsl(268, 70%, 70%);
    transform: translateY(-3px) scale(1.05);


}

/* Profile Section */
.profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto; /* Push the profile to the right side */
}

/* Profile Image */
.profile-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}



/* Profile Name */
.profile-name {
  font-weight: bold;
  color: #491784;
}

.search-bar button[type="submit"] {
  background-color: #491784;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 0;
  right: 0;
  transition: .9s ease;
}
.dark-mode .search-bar button[type="submit"]{
  color: rgb(255, 255, 255);
  background-color: hsl(268, 75%, 67%);
}
.dark-mode .search-bar button[type="submit"]:hover{
  color: rgb(255, 255, 255);
  background-color: hsl(269, 75%, 44%);
}
.search-bar button[type="submit"]:hover {
  transform: scale(1.1);
  color: rgb(255, 255, 255);
  background-color: hsl(268, 70%, 70%);
}

/* Responsive Design */
@media (max-width: 768px) {
  .search-bar {
    left: 27%;
    width: 200px; /* Make search bar wider on small screens */
  }
  .profile {
    margin-left: 1rem; /* Less margin on smaller screens */
  }
}
</style>
