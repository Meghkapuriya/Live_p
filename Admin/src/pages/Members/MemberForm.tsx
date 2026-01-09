import React, { useRef, useState } from "react";
import { APIClient } from "../../helpers/api_helper";
import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Row,
  Spinner,
} from "reactstrap";

const api = new APIClient();

/* ================= TYPES ================= */

interface MemberFormData {
  name: string;
  position: string;
  rank: string;
  category: string;
  photo: File | null;
}

const MemberForm: React.FC = () => {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<MemberFormData>({
    name: "",
    position: "",
    rank: "",
    category: "",
    photo: null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  /* ================= INPUT CHANGE ================= */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= PHOTO CHANGE ================= */

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      photo: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("position", formData.position);
      payload.append("rank", formData.rank);
      payload.append("category", formData.category);

      if (formData.photo) {
        payload.append("photo", formData.photo);
      }

      await api.create("/api/members", payload);

      alert("Member added successfully ✅");

      // reset
      setFormData({
        name: "",
        position: "",
        rank: "",
        category: "",
        photo: null,
      });

      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      console.error(err);
      alert("Failed to add member ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="page-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xl={8} lg={9}>
            <Card className="shadow-sm">
              <CardBody className="p-4 p-lg-5">
                <h4 className="mb-2">Add Member</h4>
                <p className="text-muted mb-4">
                  Add member details visible on the website.
                </p>

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <FormGroup className="mb-3">
                        <Label>Name</Label>
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup className="mb-3">
                        <Label>Position</Label>
                        <Input
                          type="text"
                          name="position"
                          value={formData.position}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <FormGroup className="mb-3">
                        <Label>Rank</Label>
                        <Input
                          type="number"
                          name="rank"
                          value={formData.rank}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup className="mb-3">
                        <Label>Category</Label>
                        <Input
                          type="text"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* PHOTO */}
                  <Row className="align-items-center">
                    <Col md={6}>
                      <FormGroup className="mb-3">
                        <Label>Photo</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          innerRef={fileRef}
                          onChange={handlePhotoChange}
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6} className="text-center">
                      {preview ? (
                        <img
                          src={preview}
                          alt="Preview"
                          className="rounded-circle border"
                          style={{
                            width: 160,
                            height: 160,
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          className="border rounded-circle d-flex align-items-center justify-content-center text-muted"
                          style={{ width: 160, height: 160 }}
                        >
                          No image
                        </div>
                      )}
                    </Col>
                  </Row>

                  <div className="text-end mt-4">
                    <Button color="primary" disabled={loading}>
                      {loading && <Spinner size="sm" className="me-2" />}
                      Save Member
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MemberForm;
