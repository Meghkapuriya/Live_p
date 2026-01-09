// ================================
// 2. FIXED LOGIN COMPONENT
// ================================
import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
  FormFeedback,
  Alert,
  Spinner,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { loginUser, resetLoginFlag } from "../../slices/thunks";
import { createSelector } from "reselect";
import logoLight from "../../assets/images/logo-light.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";

const Login = () => {
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);

  const selectState = (state: any) => state.Login;
  const selectData = createSelector(selectState, (state) => ({
    error: state.error,
    errorMsg: state.errorMsg,
    success: state.success,
  }));

  const { error, errorMsg, success } = useSelector(selectData);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: async (values) => {
      setLoader(true);

      const result = await dispatch(loginUser(values));

      if (result?.step === "otp_required") {
        navigate("/verify-otp");
        return;
      }

      if (result?.step === "logged_in") {
        navigate("/dashboard");
      }

      setLoader(false);
    },
  });

  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => {
        dispatch(resetLoginFlag());
        setLoader(false);
      }, 3000);
    }
  }, [dispatch, errorMsg]);

  document.title = "Admin Login";

  return (
    <ParticlesAuth>
      <div className="auth-page-content mt-lg-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4">
                <CardBody className="p-4">
                  <div className="text-center">
                    <img src={logoLight} alt="" height="20" />
                    <h5 className="text-primary mt-3">Welcome Back</h5>
                    <p className="text-muted">Sign in to continue</p>
                  </div>

                  {error && <Alert color="danger">{error}</Alert>}

                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                    }}
                  >
                    <div className="mb-3">
                      <Label>Email</Label>
                      <Input
                        name="email"
                        type="email"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.email}
                        invalid={
                          !!(
                            validation.touched.email && validation.errors.email
                          )
                        }
                      />
                      <FormFeedback>{validation.errors.email}</FormFeedback>
                    </div>

                    <div className="mb-3">
                      <Label>Password</Label>
                      <div className="position-relative">
                        <Input
                          name="password"
                          type={passwordShow ? "text" : "password"}
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
                        <button
                          type="button"
                          className="btn btn-link position-absolute end-0 top-0"
                          onClick={() => setPasswordShow(!passwordShow)}
                        >
                          👁
                        </button>
                        <FormFeedback>
                          {validation.errors.password}
                        </FormFeedback>
                      </div>
                    </div>

                    <div className="text-end mb-3">
                      <Link to="/forgot-password">Forgot password?</Link>
                    </div>

                    <Button
                      color="success"
                      className="w-100"
                      disabled={loader}
                      type="submit"
                    >
                      {loader && <Spinner size="sm" className="me-2" />}
                      Sign In
                    </Button>
                  </Form>

                  <div className="mt-4 text-center">
                    <p>
                      Don't have an account? <Link to="/register">Sign up</Link>
                    </p>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </ParticlesAuth>
  );
};

export default Login;
