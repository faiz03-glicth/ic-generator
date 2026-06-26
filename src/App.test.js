import { render, screen } from '@testing-library/react';
import App from './App';

test('renders IC Generator heading', () => {
  render(<App />);
  const heading = screen.getByText(/IC Generator/i);
  expect(heading).toBeInTheDocument();
});