import { Flex } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <>
      <div style={{ backgroundColor: 'white', padding: 5, width: '100vw', margin: 'auto' }} className="container copyright text-center mt-4">
        <Flex justifyContent={'center'} >
          Designed by <Link href="https://shivaverma1115.github.io/" target='_blank'><strong className="px-1 sitename">Shiva Verma</strong></Link>
        </Flex>
      </div>
    </>
  );
};

export default Footer;
