import React, { ReactEventHandler } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Heading,
  Portal,
} from "@chakra-ui/react";
import { BiDotsVerticalRounded, BiEdit, BiTrash } from "react-icons/bi";

type MyMenuProps = {
  onEditOpen: ReactEventHandler;
  onOpen: ReactEventHandler;
};

const menuListStyles: React.CSSProperties = {
  position: "absolute",
  zIndex: 9999,
};

const MyMenu: React.FC<MyMenuProps> = ({ onEditOpen, onOpen }) => (
  <Menu>
    {({ isOpen }) => (
      <>
        <MenuButton>
          <BiDotsVerticalRounded size="1.6rem" />
        </MenuButton>
        {isOpen && (
          <Portal>
            <MenuList style={menuListStyles}>
              <MenuItem gap="0.5rem" onClick={onEditOpen}>
                <BiEdit size={20} color="#90CDF4" />
                <Heading as="h4" size="sm" color="#90CDF4">
                  Edit
                </Heading>
              </MenuItem>
              <MenuItem gap="0.5rem" onClick={onOpen}>
                <BiTrash size={20} color="red" />
                <Heading as="h4" size="sm" color="red">
                  Delete
                </Heading>
              </MenuItem>
            </MenuList>
          </Portal>
        )}
      </>
    )}
  </Menu>
);

export default MyMenu;
