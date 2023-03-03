import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useRouter } from 'next/router';

const SearchBar = () => {
  const router = useRouter();
  const [key, setKey] = useState('');

  const handleSearch = (e) => {
    if (key.trim() !== '') {
      router.push(`/search?key=${key}`);
    }
    e.preventDefault();
  };
  return (
    <Form onSubmit={handleSearch}>
      <Form.Control
        type="text"
        placeholder="search"
        style={{
          width: '16rem',
          borderRadius: '2rem',
          margin: '0 auto',
          padding: '8px 15px',
        }}
        onChange={(e) => setKey(e.target.value)}
        value={key}
      />
    </Form>
  );
};

export default SearchBar;
