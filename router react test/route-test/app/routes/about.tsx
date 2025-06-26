import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About - React Router App" },
    { name: "description", content: "Learn about our React Router app" },
  ];
}

export default function About() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">About Page</h1>
      <p className="mb-4">
        This is an example about page to demonstrate routing in React Router.
      </p>
      <p>
        React Router is a powerful library for handling navigation and routing in React applications.
      </p>
    </div>
  );
}
