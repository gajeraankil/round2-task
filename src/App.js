import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

const App = () => {
  const [submitData, setSubmitData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    setSubmitData(JSON.parse(localStorage.getItem("data")));
  }, []);

  const schema = Yup.object().shape({
    name: Yup.string().required("Please Enter Name"),
    email: Yup.string().required("Please Enter Email").email(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
    },
    validationSchema: schema,
    onSubmit: (values, { resetForm }) => {
      const updatedData = [...submitData];

      if (editIndex !== null) {
        updatedData[editIndex] = {
          name: values.name,
          email: values.email,
        };
      } else {
        updatedData.push({
          name: values.name,
          email: values.email,
        });
      }
      setSubmitData(updatedData);
      localStorage.setItem("data", JSON.stringify(updatedData));
      setEditIndex(null);
      resetForm();
    },
  });

  const handleUpdate = (index) => {
    const selectedData = submitData[index];
    formik.setValues(selectedData);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedData = submitData.filter((_, i) => index !== i);
    setSubmitData(updatedData);
    localStorage.setItem("data", JSON.stringify(updatedData));
  };

  return (
    <>
      <div style={{ marginBottom: "50px" }}>
        <form onSubmit={formik.handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label>Name: </label>
            <input
              name="name"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name ? (
              <div style={{ color: "red" }}>{formik.errors.name}</div>
            ) : null}
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label>Email: </label>
            <input
              name="email"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <div style={{ color: "red" }}>{formik.errors.email}</div>
            ) : null}
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {submitData.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>
                  <button
                    style={{ marginRight: "16px" }}
                    type="button"
                    onClick={() => handleUpdate(index)}
                  >
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(index)}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default App;
