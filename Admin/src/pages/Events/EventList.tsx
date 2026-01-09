import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  Button,
  Badge,
  Spinner,
  Container,
  Row,
  Col,
} from "reactstrap";
import { APIClient } from "../../helpers/api_helper";

const api = new APIClient();

interface EventItem {
  id: number;
  title: string;
  end_date: string;
  status: "upcoming" | "recent" | "past";
  photo_url?: string | null;
}

const EventList = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null); // ✅

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res: any = await api.get("/api/events");
      const all = [
        ...(res.upcoming || []),
        ...(res.recent || []),
        ...(res.past || []),
      ].sort(
        (a: EventItem, b: EventItem) =>
          new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
      );
      setEvents(all);
    } catch {
      alert("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE EVENT ================= */

  const handleDelete = async (id: number) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirm) return;

    try {
      setDeletingId(id);

      await api.delete(`/api/events/${id}`);

      // ✅ remove from state (no refetch needed)
      setEvents((prev) => prev.filter((e) => e.id !== id));

      alert("Event deleted successfully ✅");
    } catch (err) {
      alert(err || "Failed to delete event ❌");
    } finally {
      setDeletingId(null);
    }
  };

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

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between">
                <h5 className="mb-0">Events</h5>
                <Link to="/events/create">
                  <Button color="primary" size="sm">
                    + Add Event
                  </Button>
                </Link>
              </CardHeader>

              <CardBody className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th className="text-center">Image</th>
                        <th>Title</th>
                        <th>End Date</th>
                        <th>Status</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {events.map((e) => (
                        <tr key={e.id}>
                          <td>#{e.id}</td>

                          <td className="text-center">
                            {e.photo_url ? (
                              <img
                                src={e.photo_url}
                                alt=""
                                className="rounded"
                                style={{
                                  width: 44,
                                  height: 44,
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              "N/A"
                            )}
                          </td>

                          <td>{e.title}</td>
                          <td>{new Date(e.end_date).toLocaleDateString()}</td>

                          <td>
                            <Badge color="info">{e.status}</Badge>
                          </td>

                          <td className="text-end">
                            <Link
                              to={`/events/view/${e.id}`}
                              className="btn btn-light btn-sm me-2"
                            >
                              View
                            </Link>

                            <Link
                              to={`/events/edit/${e.id}`}
                              className="btn btn-info btn-sm me-2"
                            >
                              Edit
                            </Link>

                            {/* ✅ DELETE */}
                            <Button
                              color="danger"
                              size="sm"
                              disabled={deletingId === e.id}
                              onClick={() => handleDelete(e.id)}
                            >
                              {deletingId === e.id ? "Deleting..." : "Delete"}
                            </Button>
                          </td>
                        </tr>
                      ))}

                      {events.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-4">
                            No events found
                          </td>
                        </tr>
                      )}
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

export default EventList;
