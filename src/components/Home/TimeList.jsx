import React, { useEffect } from 'react';

import { findDate } from '../../api/amitaApi';
function RevereseTimeConvertor(time) {
  return (
    parseInt(time / 3600).toString() +
    ':' +
    (parseInt((time % 3600) / 60) < 10 ? '0' : '') +
    parseInt((time % 3600) / 60).toString()
  );
}

export const TimeList = (props) => {
  const { day, time, selected, setSelected } = props;
  const data = day.getMonth() + 1 + '/' + day.getDate();
  const currentDay = new Date();
  const limit =
    currentDay.getHours() * 3600 + currentDay.getMinutes() * 60 + currentDay.getSeconds();
  const today = currentDay.getDate() === day.getDate();
  const [orderList, setOrderList] = React.useState([]);

  useEffect(() => {
    findDate(data).then((res) => {
      setOrderList(res);
    });
  }, [day]);
  console.log(orderList);
  const findTime = (hour) => {
    const t = orderList.find((data) => data.hour === hour);
    if (t) return false;
    return true;
  };

  return (
    <div>
      <div className="text-left  ml-5">Боломжит цагууд</div>
      <div className="grid grid-cols-3 grid-flow-row gap-4 place-items-center">
        {time?.map((t, idx) => {
          const converted = RevereseTimeConvertor(t);
          const check = selected === converted;
          if ((today ? limit < t : true) && findTime(converted)) {
            return (
              <div
                key={parseInt(idx) + 1}
                onClick={() => (check ? setSelected(null) : setSelected(converted))}
                className={check ? 'selected-time-button' : 'time-button'}>
                {converted}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};
