import React from 'react';
import { Component } from '../types';
import DropdownNavbar from '../DropdownNavbar';

interface BuilderDropdownNavbarProps {
  component: Component;
}

const BuilderDropdownNavbar: React.FC<BuilderDropdownNavbarProps> = ({ component }) => {
  return <DropdownNavbar {...component.props} />;
};

export default BuilderDropdownNavbar; 