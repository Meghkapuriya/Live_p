import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIClient } from "../../helpers/api_helper";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Button,
  Spinner,
} from "reactstrap";

const api = new APIClient();

/* ================= TYPES ================= */

interface Announcement {
  id: number;
  title: string;
  description?: string | null;
  link?: string | null;
  end_date: string;
  photo_url?: string | null;
}

const AnnouncementList: React.FC = () => {
  const navigate = useNavigate();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /* ================= LOAD ANNOUNCEMENTS ================= */

  useEffect(() => {
    api
      .get("/api/announcements")
      .then((res: any) => {
        let list: Announcement[] = [];

        // Case 1: API directly returns array
        if (Array.isArray(res)) {
          list = res;
        }
        // Case 2: { data: [] }
        else if (Array.isArray(res?.data)) {
          list = res.data;
        }
        // Case 3: Laravel pagination { data: { data: [] } }
        else if (Array.isArray(res?.data?.data)) {
          list = res.data.data;
        }
        // Case 4: { announcements: [] }
        else if (Array.isArray(res?.announcements)) {
          list = res.announcements;
        }

        setAnnouncements(list);
      })
      .catch(() => {
        alert("Failed to load announcements ❌");
        setAnnouncements([]);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ================= DELETE ================= */

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Delete this announcement?");
    if (!confirmDelete) return;

    try {
      const payload = new FormData();
      payload.append("_method", "DELETE");

      await api.create(`/api/announcements/${id}`, payload);

      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Delete failed ❌");
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="page-content">
        <div className="d-flex justify-content-center align-items-center mt-5">
          <Spinner />
          <span className="ms-2">Loading announcements...</span>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col xl={12}>
            <Card className="shadow-sm">
              <CardBody>
                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="mb-0">Announcements</h4>

                  <Button
                    color="primary"
                    onClick={() => navigate("/announcements/create")}
                  >
                    + Add Announcement
                  </Button>
                </div>

                {/* TABLE */}
                <div className="table-responsive">
                  <Table className="align-middle table-nowrap mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: 80 }}>ID</th>
                        <th style={{ width: 100 }}>Image</th>
                        <th>Title</th>
                        <th style={{ width: 160 }}>End Date</th>
                        <th style={{ width: 220 }} className="text-end">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {announcements.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="text-center text-muted py-4"
                          >
                            No announcements found
                          </td>
                        </tr>
                      )}

                      {announcements.map((a) => (
                        <tr key={a.id}>
                          <td>#{a.id}</td>

                          <td className="text-center">
                            {a.photo_url ? (
                              <img
                                src={a.photo_url}
                                alt={a.title}
                                className="rounded"
                                style={{
                                  width: 44,
                                  height: 44,
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <div
                                className="border rounded text-muted small d-flex align-items-center justify-content-center"
                                style={{ width: 44, height: 44 }}
                              >
                                N/A
                              </div>
                            )}
                          </td>

                          <td className="fw-medium">{a.title}</td>

                          <td>{new Date(a.end_date).toLocaleDateString()}</td>

                          <td className="text-end">
                            <Button
                              size="sm"
                              color="light"
                              className="me-2"
                              onClick={() =>
                                navigate(`/announcements/view/${a.id}`)
                              }
                            >
                              View
                            </Button>

                            <Button
                              size="sm"
                              color="info"
                              className="me-2"
                              onClick={() =>
                                navigate(`/announcements/edit/${a.id}`)
                              }
                            >
                              Edit
                            </Button>

                            <Button
                              size="sm"
                              color="danger"
                              onClick={() => handleDelete(a.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AnnouncementList;
