# Z Plus-UI

## Creating a New React Project

1. **Create a new React project:**

   ```bash
   npx create-react-app zplus-ui
   ```

2. **Navigate to the project directory:**

   ```bash
   cd zplus-ui
   ```

   Once inside delete the files **`App.css`**, **`App.test.js`**, **`index.css`**, and **`logo.svg`** that are in **src** folder.

## Setting Up Bootstrap

1. **Install Bootstrap:**

   ```bash
   yarn add bootstrap
   ```

2. **Import Bootstrap styles:**

   In the application file (e.g. **`src/index.js`**), import Bootstrap's CSS:

   ```bash
   import 'bootstrap/dist/css/bootstrap.min.css'
   ```

## Setting Up Redux Toolkit

1. **Install Redux Toolkit and React redux:**

   ```bash
   yarn add @reduxjs/toolkit react-redux
   ```

2. **Create a Redux store:**
   Create a **`store.js`** file in the project's source directory (e.g. **`src/store/store.js`**) and set up the Redux store using **`configureStore`** from Redux Toolkit.

3. **Create Slice:**
   Create slice files in a **`slices`** directory (e.g. **`src/store/slices`**) and define the reducers and actions using Redux Toolkit's **`createSlice`**.

4. **Provide store:**
   Provide the store in the top level file (e.g. **`App.js`**) by using **`Provider`** component from React-redux

## Setting Up React Router DOM

1. **Install React Router DOM:**

   ```bash
   yarn add react-router-dom
   ```

2. **Configure routing:**
   Set up the routes using **`createBrowserRouter`** provided by React Router DOM. Create a **`routes.js`** file in a **`routes`** directory (e.g. **`src/routes/routes.js`**) to define application routes.

3. **Provide router:**
   Set up the router by using **`RouterProvider`** component provided by React Router DOM in the top-level (e.g. **`App.js`**) file.

## Setting Up Axios

1. **Install Axios:**

   ```bash
   yarn add axios
   ```

2. **Create an Axios instance:**
   Instead of using the global Axios instance directly, create a custom instance **`axiosClient`** in **`api`** directory (e.g **`src/api/axios.js`**) with default configuration options like headers, baseURLs.

3. **Creating an API service:**
   Inside **`src`** directory, create a folder named **`services`**. Inside this folder we can have different services files for different purpose. Like **`UserServices.js`** where we can define functions (**`fetchUserData()`**) for making specific API requests.
