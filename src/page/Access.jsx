import React, { useEffect } from 'react';

import { Head } from '../components/Head';
import {
  getUserID,
  updateOrder,
  FetchTimeRule,
  findUser,
  calendarAdd,
  updateEventID
} from '../api/amitaApi';
import { CompanyHeader } from '../components/Home/company/CompanyHeader';

import { RotatingLines } from 'react-loader-spinner';

export const Access = () => {
  var query = window.location.search.substring(1).split('&');
  const checkoutId = query[1]?.split('=') || '';
  const description = query[2]?.split('=') || '';
  const paymentId = query[3]?.split('=') || '';
  const [res, setRes] = React.useState(0);
  const [date, setDate] = React.useState(0);
  const [hour, setHour] = React.useState(0);
  useEffect(() => {
    getUserID(checkoutId[1]).then((res) => {
      if (res && description[1] === 'SUCCESS') {
        updateOrder(paymentId[1], 'paid', checkoutId[1]).catch(() => setRes(2));
        const day = res[0].date.split('/');
        setDate(res[0].day);
        setHour(res[0].hour);
        const start = new Date();
        start.setFullYear(parseInt(day[0]));
        start.setMonth(parseInt(day[1]) - 1);
        start.setDate(parseInt(day[2]));
        const end = new Date();
        end.setFullYear(parseInt(day[0]));
        end.setMonth(parseInt(day[1]) - 1);
        end.setDate(parseInt(day[2]));
        const hm = res[0].hour.split(':');
        FetchTimeRule()
          .then((time) => {
            const delay = time[0]?.delay;
            const dl = delay?.split(':');
            start.setHours(parseInt(hm[0]));
            end.setHours(parseInt(hm[0]) + parseInt(dl[0]));
            start.setMinutes(parseInt(hm[1]));
            end.setMinutes(parseInt(dl[1]) + parseInt(hm[1]));
            start.setSeconds(0);
            end.setSeconds(0);
            findUser(res[0].userID)
              .then((result) => {
                calendarAdd(
                  start,
                  end,
                  result[0].firstname + ' ' + result[0].phone,
                  'phone: ' +
                    result[0].phone +
                    (result[0].gmail ? '\ngmail: ' + result[0].gmail : '')
                )
                  .then((data) => {
                    updateEventID(
                      data?.data.data.id,
                      data?.data.data.end.dateTime,
                      data?.data.data.start.dateTime,
                      checkoutId[1]
                    )
                      .then(setRes(1))
                      .catch(() => setRes(2));
                  })
                  .catch(() => setRes(2));
              })
              .catch(() => setRes(2));
          })
          .catch(() => setRes(2));
      }
    });
  }, []);
  return (
    <div>
      <Head title="Access" description="hello" />
      <div className="flex-col text-center text-lg">
        <div className="inline self-center">
          <CompanyHeader />
        </div>
        {res == 0 ? (
          <div className="center">
            <RotatingLines
              strokeColor="green"
              strokeWidth="5"
              animationDuration="0.50"
              width="200"
              visible={true}
            />
          </div>
        ) : res == 1 ? (
          <>
            <div className="center">Таны захиалга баталгаажлаа</div>
            <div className="center">
              {date[0]} оны {date[1]} сарын {date[2]} өдрийн {hour}
            </div>
          </>
        ) : (
          <div className="center">Амжилтгүй боллоо</div>
        )}
      </div>
    </div>
  );
};
