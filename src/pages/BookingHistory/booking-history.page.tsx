import {
  Button,
  Col,
  DatePicker,
  Row,
  Select,
  Space,
  Table,
  TableProps,
} from 'antd';
import Title from 'antd/es/typography/Title';
import dayjs from 'dayjs';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  Booking,
  getBookingByAccountIdThunk,
  selectBookingHistory,
  selectSlots,
  selectUser,
} from '../../redux';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
`;

const HistoryContainer = styled.div`
  width: 80%;
  max-height: 550px;
  background: #fff;
  padding: 1rem;
`;

const PageTitle = styled(Title)`
  padding-block: 2.5rem;
`;

const TableWrapper = styled.div`
  height: 450px;
  width: 100%;
  overflow-y: scroll;
`;

const mockData: Booking[] = [
  {
    shopName: 'Starbucks',
    bookingDate: '01/01/2021',
    total: 100,
    tableName: 'shop1',
    slotId: 1,
  },
  {
    shopName: 'Starbucks',
    bookingDate: '01/01/2021',
    total: 100,
    tableName: 'shop1',
    slotId: 1,
  },
  {
    shopName: 'Starbucks',
    bookingDate: '01/01/2021',
    total: 100,
    tableName: 'shop1',
    slotId: 1,
  },
  {
    shopName: 'Starbucks',
    bookingDate: '01/01/2021',
    total: 100,
    tableName: 'shop1',
    slotId: 1,
  },
  {
    shopName: 'Starbucks',
    bookingDate: '01/01/2021',
    total: 100,
    tableName: 'shop1',
    slotId: 1,
  },
  {
    shopName: 'Starbucks',
    bookingDate: '01/01/2021',
    total: 100,
    tableName: 'shop1',
    slotId: 1,
  },
  {
    shopName: 'Starbucks',
    bookingDate: '01/01/2021',
    total: 100,
    tableName: 'shop1',
    slotId: 1,
  },
  {
    shopName: 'Starbucks',
    bookingDate: '01/01/2021',
    total: 100,
    tableName: 'shop1',
    slotId: 1,
  },
  {
    shopName: 'Starbucks',
    bookingDate: '01/01/2021',
    total: 100,
    tableName: 'shop1',
    slotId: 1,
  },
  {
    shopName: 'Starbucks',
    bookingDate: '01/01/2021',
    total: 100,
    tableName: 'shop1',
    slotId: 1,
  },
  {
    shopName: 'Starbucks',
    bookingDate: '01/01/2021',
    total: 100,
    tableName: 'shop1',
    slotId: 1,
  },
];

export const BookingHistory = () => {
  const dispatch = useAppDispatch();

  const bookings = useAppSelector(selectBookingHistory);
  const user = useAppSelector(selectUser);
  const slots = useAppSelector(selectSlots);

  const [data, setData] = useState<Booking[] | undefined>(mockData);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const handleFilter = () => {
    let filteredData = bookings;

    if (startDate && endDate) {
      filteredData = filteredData?.filter((record) => {
        const recordDate = moment(record.bookingDate, 'DD/MM/YYYY');
        return recordDate.isBetween(startDate, endDate, 'day', '[]');
      });
    }

    setData(filteredData);
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setData(bookings);
  };

  const columns: TableProps<Booking>['columns'] = useMemo(
    () => [
      {
        title: 'Shop',
        dataIndex: 'shopName',
        key: 'shopName',
      },
      {
        title: 'Booking Date',
        dataIndex: 'bookingDate',
        key: 'bookingDate',
      },
      {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
      },
      {
        title: 'Table Name',
        dataIndex: 'tableName',
        key: 'tableName',
      },
      {
        title: 'Time slot',
        dataIndex: 'slotId',
        key: 'slotId',
        render: (slotId) => {
          const foundSlot = slots.find((slot) => slot.slotId === slotId);

          return (
            <span>
              {foundSlot?.startTime} - {foundSlot?.endTime}
            </span>
          );
        },
      },
    ],
    [slots],
  );

  useEffect(() => {
    if (user) {
      dispatch(getBookingByAccountIdThunk((user.id as any).toString()));
    }
  }, []);

  useEffect(() => {
    setData(bookings);
  }, [bookings]);

  return (
    <Container>
      <PageTitle level={2}>Booking History</PageTitle>
      <HistoryContainer>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Row gutter={16} justify="center" align="middle">
              <Col span={5}>
                <span>From</span>
                <DatePicker
                  style={{ width: '78%', marginLeft: '5px' }}
                  format="DD/MM/YYYY"
                  value={startDate ? dayjs(startDate, 'DD/MM/YYYY') : null}
                  onChange={(date) =>
                    setStartDate(date ? date.format('DD/MM/YYYY') : null)
                  }
                />
              </Col>
              <Col span={5}>
                <span>To</span>
                <DatePicker
                  style={{ width: '78%', marginLeft: '5px' }}
                  format="DD/MM/YYYY"
                  value={endDate ? dayjs(endDate, 'DD/MM/YYYY') : null}
                  onChange={(date) =>
                    setEndDate(date ? date.format('DD/MM/YYYY') : null)
                  }
                />
              </Col>
              <Col span={1}>
                <Space.Compact>
                  <Button type="primary" onClick={handleFilter}>
                    Search
                  </Button>
                  <Button onClick={handleReset}>Reset</Button>
                </Space.Compact>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row>
              <Col span={24}>
                <TableWrapper>
                  <Table
                    columns={columns}
                    dataSource={data}
                    style={{ height: '100%' }}
                  />
                </TableWrapper>
              </Col>
            </Row>
          </Col>
        </Row>
      </HistoryContainer>
    </Container>
  );
};