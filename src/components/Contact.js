import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';

import * as L from 'leaflet';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import './Contact.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

function Contact() {
  const position = [-22.6015, -48.8033]; 
  return (
    <section className="contact-wrapper" id="contact-section">
      <div className="contact-info">
        <h2>Nosso Contato</h2>
        <p>Rua Pedro Natálio Lorenzetti, 823</p>
        <p>Sala 2 Centro - Lençóis Paulista - SP, 18682-010</p>
        <div className="social-links">
          <a href="" target="_blank" rel="noreferrer">
            <FaFacebook size={32} color="#FFFFFF" />
          </a>
          <a href="" target="_blank" rel="noreferrer">
            <FaInstagram size={32} color="#FFFFFF" />
          </a>
          <a href="" target="_blank" rel="noreferrer">
            <FaLinkedin size={32} color="#FFFFFF" />
          </a>
          <a href="" target="_blank" rel="noreferrer">
            <FaYoutube size={32} color="#FFFFFF" />
          </a>
        </div>
      </div>
      <div className="map-container">
        <div className="map-wrapper">
          <MapContainer center={position} zoom={15} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position} icon={new L.Icon.Default()}>
              <Popup>
              FMATCH
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </section>
  );
}

export default Contact;
