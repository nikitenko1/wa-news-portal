import Link from 'next/link';
import { Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap';
import { SuitHeartFill, ExclamationDiamond } from 'react-bootstrap-icons';

const AssessmentButton = () => {
  return (
    <>
      <DropdownButton
        as={ButtonGroup}
        drop="top"
        variant="success"
        title="Assessment form"
        style={{
          position: 'fixed',
          bottom: '5px',
          right: '5px',
          zIndex: '100',
        }}
      >
        <Dropdown.Item>
          <Link
            href="/assessment/mental-health"
            className="text-decoration-none"
          >
            <span>mental health assessment</span>
            <SuitHeartFill
              style={{
                color: 'red',
                fontSize: '20px',
                marginLeft: '3px',
              }}
            />
          </Link>
        </Dropdown.Item>
        <Dropdown.Item>
          <Link href="/assessment/covid" className="text-decoration-none">
            <div className="d-flex align-items-center">
              <span>assess the risk of contracting Covid-19</span>
              <ExclamationDiamond
                style={{
                  color: 'black',
                  fontSize: '20px',
                  marginLeft: '3px',
                }}
              />
            </div>
          </Link>
        </Dropdown.Item>
      </DropdownButton>
    </>
  );
};

export default AssessmentButton;
