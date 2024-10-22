import React from "react";
import { Card, Button, ListGroup } from "react-bootstrap";

const FeedData = [
  {
    title: "Cras justo odio",
    icon: "bi bi-bell",
    variant: "primary",
    date: "6 minute ago",
  },
  {
    title: "New user registered.",
    icon: "bi bi-person",
    variant: "info",
    date: "6 minute ago",
  },
  {
    title: "Server #1 overloaded.",
    icon: "bi bi-hdd",
    variant: "danger",
    date: "6 minute ago",
  },
  {
    title: "New order received.",
    icon: "bi bi-bag-check",
    variant: "success",
    date: "6 minute ago",
  },
  {
    title: "Cras justo odio",
    icon: "bi bi-bell",
    variant: "dark",
    date: "6 minute ago",
  },
  {
    title: "Server #1 overloaded.",
    icon: "bi bi-hdd",
    variant: "warning",
    date: "6 minute ago",
  },
  
];

const Feeds = () => {
  return (
    <Card>
      <Card.Body>
        <Card.Title as="h5">Feeds</Card.Title>
        <Card.Subtitle className="mb-2 text-muted" as="h6">
          Widget you can use
        </Card.Subtitle>
        <ListGroup variant="flush" className="mt-4">
          {FeedData.map((feed, index) => (
            <ListGroup.Item
              key={index}
              action
              href="/"
              className="d-flex align-items-center p-3 border-0"
            >
              <Button
                className="rounded-circle me-3"
                size="sm"
                variant={feed.variant}
              >
                <i className={feed.icon}></i>
              </Button>
              {feed.title}
              <small className="ms-auto text-muted text-small">
                {feed.date}
              </small>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default Feeds;
