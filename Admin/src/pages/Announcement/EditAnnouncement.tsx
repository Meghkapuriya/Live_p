import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const EditAnnouncement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    end_date: "",
  });

  /* ================= LOAD ANNOUNCEMENT ================= */

  useEffect(() => {
    if (!id) return;

    api
      .get(`/api/announcements/${id}`)
      .then((res) => {
        const data = res?.data?.data ?? res?.data ?? null;
        if (!data) return;

        setFormData({
          title: data.title,
          description: data.description || "",
          link: data.link || "",
          end_date: data.end_date?.slice(0, 10),
        });

        // ✅ existing image from backend
        setPreview(data.photo_url || null);
      })
      .catch(() => alert("Failed to load announcement ❌"))
      .finally(() => setLoading(false));
  }, [id]);

  /* ================= CHANGE ================= */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ================= UPDATE ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description || "");
      payload.append("link", formData.link || "");
      payload.append("end_date", formData.end_date);
      payload.append("_method", "PUT"); // 🔥 Laravel

      if (imageFile) {
        payload.append("photo", imageFile);
      }

      await api.create(`/api/announcements/${id}`, payload);

      alert("Announcement updated successfully ✅");
      navigate("/announcements/list");
    } catch {
      alert("Update failed ❌");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI STATES ================= */

  if (loading) {
    return (
      <div className="page-content">
        <div className="d-flex justify-content-center align-items-center mt-5">
          <Spinner />
          <span className="ms-2">Loading announcement...</span>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="page-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xl={10} lg={11}>
            <Card className="shadow-sm">
              <CardBody className="p-4 p-lg-5">
                <h4 className="mb-4 border-bottom pb-3">
                  Edit Announcement
                </h4>

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <FormGroup className="mb-3">
                        <Label>Title</Label>
                        <Input
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup className="mb-3">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          name="end_date"
                          value={formData.end_date}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <FormGroup className="mb-3">
                    <Label>Link</Label>
                    <Input
                      type="url"
                      name="link"
                      value={formData.link}
                      onChange={handleChange}
                      placeholder="https://example.com"
                    />
                  </FormGroup>

                  <FormGroup className="mb-3">
                    <Label>Description</Label>
                    <Input
                      type="textarea"
                      rows={4}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </FormGroup>

                  {/* IMAGE */}
                  <FormGroup className="mb-4">
                    <Label>Image</Label>

                    {preview && (
                      <div className="mb-3">
                        <img
                          src={preview}
                          alt="Preview"
                          className="img-fluid rounded"
                          style={{ maxHeight: 220, objectFit: "cover" }}
                        />
                      </div>
                    )}

                    <Input
                      innerRef={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </FormGroup>

                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      type="button"
                      color="secondary"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>

                    <Button color="primary" disabled={saving}>
                      {saving ? "Saving..." : "Update Announcement"}
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

export default EditAnnouncement;
