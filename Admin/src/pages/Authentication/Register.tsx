import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Input,
  Label,
  Form,
  FormFeedback,
  Button,
  Spinner,
} from "reactstrap";

import * as Yup from "yup";
import { useFormik } from "formik";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { registerUser, resetRegisterFlag } from "../../slices/thunks";

import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createSelector } from "reselect";

import logoLight from "../../assets/images/logo-light.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";

const Register = () => {
  const navigate = useNavigate();
  const dispatch: any = useDispatch();

  const [loader, setLoader] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      email: "",
      first_name: "",
      password: "",
      confirm_password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      first_name: Yup.string().required("Please Enter Your Username"),
      password: Yup.string().min(8).required("Please Enter Your Password"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
    }),

    onSubmit: (values) => {
      const formData = new FormData();

      formData.append("name", values.first_name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("password_confirmation", values.confirm_password);

      if (avatar) {
        formData.append("avatar", avatar);
      }

      dispatch(registerUser(formData));
      setLoader(true);
    },
  });

  const selectLayoutState = (state: any) => state.Account;
  const registerdatatype = createSelector(selectLayoutState, (account) => ({
    success: account.success,
    error: account.error,
  }));

  const { success, error } = useSelector(registerdatatype);

  useEffect(() => {
    if (success) {
      toast.success("Registration successful. Redirecting...");
      setTimeout(() => navigate("/login"), 3000);
    }

    if (error) {
      setLoader(false);
    }

    setTimeout(() => {
      dispatch(resetRegisterFlag());
    }, 3000);
  }, [success, error, dispatch, navigate]);

  document.title = "Admin Register";

  return (
    <ParticlesAuth>
      <div className="auth-page-content mt-lg-5">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mt-sm-5 mb-4 text-white-50">
                <Link to="/" className="d-inline-block auth-logo">
                  <img src={logoLight} alt="" height="20" />
                </Link>
                <p className="mt-3 fs-15 fw-medium">
                  Premium Admin & Dashboard Template
                </p>
              </div>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4">
                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <h5 className="text-primary">Create New Account</h5>
                    <p className="text-muted">Admin Registration</p>
                  </div>

                  <div className="p-2 mt-4">
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                      }}
                    >
                      {success && (
                        <Alert color="success">
                          Registered successfully. Redirecting to login…
                        </Alert>
                      )}

                      {error && (
                        <Alert color="danger">
                          Email already exists. Try another email.
                        </Alert>
                      )}

                      {/* EMAIL */}
                      <div className="mb-3">
                        <Label>Email *</Label>
                        <Input
                          name="email"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email}
                          invalid={
                            !!(
                              validation.touched.email &&
                              validation.errors.email
                            )
                          }
                        />
                        <FormFeedback>{validation.errors.email}</FormFeedback>
                      </div>

                      {/* USERNAME */}
                      <div className="mb-3">
                        <Label>Username *</Label>
                        <Input
                          name="first_name"
                          type="text"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.first_name}
                          invalid={
                            !!(
                              validation.touched.first_name &&
                              validation.errors.first_name
                            )
                          }
                        />
                        <FormFeedback>
                          {validation.errors.first_name}
                        </FormFeedback>
                      </div>

                      {/* PASSWORD */}
                      <div className="mb-3">
                        <Label>Password *</Label>
                        <Input
                          name="password"
                          type="password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.password}
                          invalid={
                            !!(
                              validation.touched.password &&
                              validation.errors.password
                            )
                          }
                        />
                        <FormFeedback>
                          {validation.errors.password}
                        </FormFeedback>
                      </div>

                      {/* CONFIRM PASSWORD */}
                      <div className="mb-3">
                        <Label>Confirm Password *</Label>
                        <Input
                          name="confirm_password"
                          type="password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.confirm_password}
                          invalid={
                            !!(
                              validation.touched.confirm_password &&
                              validation.errors.confirm_password
                            )
                          }
                        />
                        <FormFeedback>
                          {validation.errors.confirm_password}
                        </FormFeedback>
                      </div>

                      {/* AVATAR */}
                      <div className="mb-3">
                        <Label>Avatar (optional)</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e: any) => setAvatar(e.target.files[0])}
                        />
                      </div>

                      <Button
                        color="success"
                        className="w-100"
                        type="submit"
                        disabled={loader}
                      >
                        {loader && <Spinner size="sm" className="me-2" />}
                        Sign Up
                      </Button>
                    </Form>
                  </div>
                </CardBody>
              </Card>

              <div className="mt-4 text-center">
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="fw-semibold">
                    Sign In
                  </Link>
                </p>
              </div>
            </Col>
          </Row>
        </Container>

        <ToastContainer />
      </div>
    </ParticlesAuth>
  );
};

export default Register;
