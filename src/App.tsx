import React, { useEffect, useState } from 'react';
import './App.css';
import getConfiguration  from './api/configuration';
import { Button, Modal, Table } from 'react-bootstrap';
import Loader from './components/Loader';

function App() {
  const [ip, setIp] = useState(''); //88.201.211.167
  const [configs, setConfigs] = useState([] as Array<{ip: string, contact: string, machine: string, location: string, hardware: string, software: string}>);
  const [show, setShow] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null as string | null);

  useEffect(() => {
    setLoading(false);
  }, [configs])

  const handleClose = () => setShow(false);

  async function getConf() {
    setShow(false);
    setLoading(true);

    try {
      const ips = ip.split(';');
      const res = await getConfiguration(ips);
      // const data = res.data;

      const data = JSON.parse('{"88.201.211.167":"homuwell;DESKTOP-PUN7I54;deadinsidezxc;Hardware: Intel64 Family 6 Model 142 Stepping 10 AT/AT COMPATIBLE - Software: Windows Version 6.3 (Build 19042 Multiprocessor Free);"}');
      // const data = {};
      for (let key of Object.keys(data)) {
        setConfigs(prev => {
          // @ts-ignore
          let [contact, machine, location, hardware] = data[key].split(';');
          const softWareStrIndex = hardware.indexOf('Software:');
          let software = '';
          if (softWareStrIndex !== -1) {
            software = hardware.slice(softWareStrIndex);
            hardware = hardware.slice(0, softWareStrIndex);
          }
          prev.push({ ip: key, contact, machine, location, hardware, software });
          return prev;
        })
      }
    } catch (e) {
      setError(`Ошибка загрузки данных, подробнее: ${e}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      {!loading && !show && <header>SNMP протокол для сбора информации о конфигурации ЭВМ</header>}
      {loading && <Loader />}
      {error && (<div style={{width: '100%', display: 'flex', justifyContent: 'center', fontWeight: 'bold', color: 'red', margin: '50px 0'}}>{error}</div>)}
      {!loading && configs.length && (<div className="table-container">
        <Table bordered>
        <thead>
        <tr>
          <th>IP</th>
          <th>Contact</th>
          <th>Machine</th>
          <th>Location</th>
          <th>Hardware</th>
          <th>Software</th>
        </tr>
        </thead>
        <tbody>
        {configs.map((config, index) => (
          <tr key={config.ip}>
            <td>{config.ip}</td>
            <td>{config.contact}</td>
            <td>{config.machine}</td>
            <td>{config.location}</td>
            <td>{config.hardware}</td>
            <td>{config.software}</td>
          </tr>
        ))}
        </tbody>
        </Table>
      </div>) || ''}
      {!loading && !show && configs.length === 0 && (<div style={{width: '100%', display: 'flex', justifyContent: 'center', fontWeight: 'bold', margin: '50px 0'}}>По указанному(ым) ip-адресу(ам) не удалось получить конфигурацию(ции)</div>)}
      {!loading && !show && (<div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}><Button onClick={() => window.location.reload()}>Задать ip заново</Button></div>)}
      <Modal show={show} onHide={handleClose} className="modal">
        <Modal.Header closeButton>
          <Modal.Title>Сбор конфигурации компьютеров</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{marginBottom: '15px'}}>При необходимости проверить несколько ip-адресов - вести их через "<b>;</b>" (без пробела)</div>
          <input placeholder="Введите ip компьютера(ов)" value={ip} onChange={(e) => setIp(e.target.value)} />
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={!ip} onClick={async () => getConf()}>Получить данные</Button>
        </Modal.Footer>
      </Modal>
      {!loading && !show && <footer>2021</footer>}
    </div>
  );
}

export default App;
