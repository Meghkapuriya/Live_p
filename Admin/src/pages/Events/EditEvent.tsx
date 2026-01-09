import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Spinner,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { APIClient } from "../../helpers/api_helper";

const api = new APIClient();

interface EventType {
  id: number;
  title: string;
  description?: string;
  end_date: string;
  link: string;
  photo_url?: string | null;
}

const EditEvent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState("");
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  /* ================= LOAD EVENT ================= */

  useEffect(() => {
    if (!id) return;

    api
      .get(`/api/events/${id}`)
      .then((res: any) => {
        const data = res?.data?.data ?? res?.data ?? res ?? null;
        if (!data) return;

        setEvent(data);
        setTitle(data.title);
        setDescription(data.description ?? "");
        setEndDate(data.end_date?.slice(0, 10));
        setLink(data.link);
        setImagePreview(data.photo_url ?? null);
      })
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  /* ================= IMAGE CHANGE ================= */

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  /* ================= UPDATE EVENT ================= */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("end_date", endDate);
    formData.append("link", link);
    if (status) {
      formData.append("status", status);
    }
    formData.append("_method", "PUT");

    if (imageFile) {
      formData.append("photo", imageFile);
    }

    api
      .create(`/api/events/${id}`, formData)
      .then(() => {
        alert("Event updated successfully ✅");
        navigate("/events/list");
      })
      .catch(() => {
        alert("Failed to update event ❌");
      })
      .finally(() => setSaving(false));
  };

  /* ================= UI STATES ================= */

  if (loading) {
    return (
      <div className="page-content">
        <div className="d-flex justify-content-center align-items-center mt-5">
          <Spinner />
          <span className="ms-2">Loading event...</span>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="page-content">
        <div className="text-center mt-5">Event not found</div>
      </div>
    );
  }

  /* ================= FORM ================= */

  return (
    <div className="page-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xl={12}>
            <Card className="shadow-sm">
              <CardBody className="">
                <h3 className="text-center border-bottom w-100 pb-3">
                  Edit Event
                </h3>

                <Form onSubmit={handleSubmit}>
                  <Row>
                    {/* ===== ROW 1 ===== */}
                    <Col xs="12" lg="4">
                      <FormGroup className="mb-4">
                        <Label>Title</Label>
                        <Input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col xs="12" lg="4">
                      <FormGroup className="mb-4">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col xs="12" lg="4">
                      <FormGroup className="mb-4">
                        <Label>Event Link</Label>
                        <Input
                          type="url"
                          value={link}
                          onChange={(e) => setLink(e.target.value)}
                          required
                        />
                      </FormGroup>
                    </Col>

                    {/* ===== ROW 2 ===== */}

                    <Col lg="4">
                      <FormGroup className="mb-4">
                        <Label>Status</Label>
                        <Input
                          type="select"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option value="">Auto (Recommended)</option>
                          <option value="upcoming">Upcoming</option>
                          <option value="recent">Recent</option>
                          <option value="past">Past</option>
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col xs="12" lg="4">
                      <FormGroup className="mb-4">
                        <Label>Description</Label>
                        <Input
                          type="textarea"
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </FormGroup>
                    </Col>

                    <Col xs="12" lg="4">
                      <FormGroup className="mb-4">
                        <Label>Event Image</Label>

                        <div className="mb-3">
                          {imagePreview ? (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="img-fluid rounded w-100"
                              style={{
                                maxHeight: 260,
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <div className="text-muted">No image available</div>
                          )}
                        </div>

                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </FormGroup>
                    </Col>

                    {/* ===== ACTIONS ===== */}
                    <Col xs="12">
                      <div className="d-flex gap-2">
                        <Button
                          color="secondary"
                          type="button"
                          onClick={() => navigate(-1)}
                        >
                          Cancel
                        </Button>

                        <Button color="primary" disabled={saving}>
                          {saving ? "Saving..." : "Update Event"}
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EditEvent;
