import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap";

import * as Yup from "yup";
import { useFormik } from "formik";

import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

import avatarFallback from "../../assets/images/users/avatar-1.jpg";
import { editProfile, resetProfileFlag } from "../../slices/thunks";

const UserProfile = () => {
  const dispatch: any = useDispatch();

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  /* ================= REDUX ================= */

  const selectProfileState = (state: any) => state.Profile;

  const profileSelector = createSelector(selectProfileState, (state) => ({
    user: state.user,
    success: state.success,
    error: state.error,
  }));

  const { user, success, error } = useSelector(profileSelector);

  /* ================= LOAD USER FROM SESSION ================= */

  useEffect(() => {
    const stored = sessionStorage.getItem("authUser");
    if (!stored) return;

    const parsed = JSON.parse(stored);
    const loggedUser = parsed.user;

    setUserName(loggedUser.name);
    setEmail(loggedUser.email);
    setAvatar(loggedUser.avatar || null);

    dispatch(resetProfileFlag());
  }, [dispatch]);

  /* ================= SYNC REDUX USER ================= */

  useEffect(() => {
    if (user && user.name) {
      setUserName(user.name);
      setEmail(user.email);
      setAvatar(user.avatar || null);
      setAvatarPreview(null);
      setAvatarFile(null);
    }
  }, [user]);

  /* ================= CLEAN OBJECT URL ================= */

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  /* ================= FORMIK ================= */

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: userName,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("name", values.name);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      dispatch(editProfile(formData));
    },
  });

  document.title = "Profile | Admin Panel";

  return (
    <div className="page-content mt-lg-5">
      <Container fluid>
        <Row>
          <Col lg="12">
            {error && <Alert color="danger">{error}</Alert>}
            {success && (
              <Alert color="success">Profile updated successfully</Alert>
            )}

            {/* USER CARD */}
            <Card>
              <CardBody className="d-flex align-items-center">
                <div className="me-3">
                  <img
                    src={avatarPreview || avatar || avatarFallback}
                    key={avatarPreview || avatar || "avatar"}
                    className="avatar-md rounded-circle img-thumbnail"
                    alt="avatar"
                  />
                </div>
                <div>
                  <h5 className="mb-1">{userName}</h5>
                  <p className="mb-0 text-muted">{email}</p>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* EDIT FORM */}
        <h4 className="card-title my-4">Edit Profile</h4>

        <Card>
          <CardBody>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
              }}
            >
              <div className="mb-3">
                <Label>Name</Label>
                <Input
                  name="name"
                  value={validation.values.name}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  invalid={
                    !!(validation.touched.name && validation.errors.name)
                  }
                />
                <FormFeedback>{validation.errors.name}</FormFeedback>
              </div>

              <div className="mb-3">
                <Label>Avatar</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e: any) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setAvatarFile(file);
                    setAvatarPreview(URL.createObjectURL(file));
                  }}
                />
              </div>

              <div className="text-center mt-4">
                <Button type="submit" color="primary">
                  Update Profile
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default UserProfile;
