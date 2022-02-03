import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import styled from 'styled-components'
import Social from "./Social";
import externalUrls from "./externalUrls";
import { ReactComponent as StakeIcon } from "../../assets/icons/stake.svg";
import { ReactComponent as BondIcon } from "../../assets/icons/bond.svg";
import { ReactComponent as PresaleIcon } from "../../assets/icons/sun.svg";
import { ReactComponent as DashboardIcon } from "../../assets/icons/dashboard.svg";
import { ReactComponent as BigHeadIcon } from "../../assets/icons/bighead-nav-header.svg";
import { ReactComponent as PoolTogetherIcon } from "../../assets/icons/33-together.svg";

import { ReactComponent as infofill } from "../../assets/icons/info-fill.svg";

import { trim, shorten } from "../../helpers";
import { useAddress, useWeb3Context } from "src/hooks/web3Context";
import useBonds from "../../hooks/Bonds";
import { Paper, Link, Box, Typography, SvgIcon } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "./sidebar.scss";

function NavContent() {
  const [isActive] = useState();
  const address = useAddress();
  const { bonds } = useBonds();
  const { chainID } = useWeb3Context();

  const checkPage = useCallback((match, location, page) => {
    const currentPath = location.pathname.replace("/", "");
    if (currentPath.indexOf("dashboard") >= 0 && page === "dashboard") {
      return true;
    }
    if (currentPath.indexOf("stake") >= 0 && page === "stake") {
      return true;
    }
    if ((currentPath.indexOf("bonds") >= 0 || currentPath.indexOf("choose_bond") >= 0) && page === "bonds") {
      return true;
    }
    return false;
  }, []);


  const CustomePaper = styled(Paper)`
    // background-image: url('/images/sidebar-image.png')
    background-color:#0f1b2a;
  `;
  
  return (
    <CustomePaper className="dapp-sidebar">
      <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          {/* <Box className="branding-header">
            <Link href="/" target="_blank">
              <img src = "/images/logo.png" style={{ "padding":"30px"}}></img>
            </Link>
            {address && (
              <div className="wallet-link">
                <Link href={`https://snowtrace.io/address/${address}`} target="_blank">
                  {shorten(address)}
                </Link>
              </div>
            )}
          </Box> */}

          <div className="dapp-menu-links">
            <div className="dapp-nav " id="navbarNav" style={{"width":"-webkit-fill-available", "margin-right":"20px"}}>
              <Link
                component={NavLink}
                id="dash-nav"
                to="/presale"
                
                isActive={(match, location) => {
                  return checkPage(match, location, "presale");
                }}
                className={`button-dapp-menu bg-color-sidebar-btn ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <SvgIcon color="primary" component={PresaleIcon} />
                  Presale
                </Typography>
              </Link>

              <Link
                component={NavLink}
                id="dash-nav"
                to="/claim"
                isActive={(match, location) => {
                  return checkPage(match, location, "claim");
                }}
                className={`button-dapp-menu bg-color-sidebar-btn ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <SvgIcon color="primary" component={infofill} />
                  Claim
                </Typography>
              </Link>

              <Link
                component={NavLink}
                id="dash-nav"
                to="/dashboard"   
                isActive={(match, location) => {
                  return checkPage(match, location, "claim");
                }}  
                className={`button-dapp-menu bg-color-sidebar-btn ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <SvgIcon color="primary" component={DashboardIcon} />
                  Dashboard
                </Typography>
              </Link>

              <Link
                component={NavLink}
                id="stake-nav"
                to="/stake"
                isActive={(match, location) => {
                  return checkPage(match, location, "stake");
                }}
                className={`button-dapp-menu  bg-color-sidebar-btn ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <SvgIcon color="primary" component={StakeIcon} />
                  Stake
                </Typography>
              </Link>

              <Link
                component={NavLink}
                id="bond-nav"
                to="/bonds"
                isActive={(match, location) => {
                  return checkPage(match, location, "bonds");
                }}
                className={`button-dapp-menu bg-color-sidebar-btn ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <SvgIcon color="primary" component={BondIcon} />
                  Bond
                </Typography>
              </Link>

        
            </div>
          </div>
        </div>
        {/* <Box className="dapp-menu-bottom" justifyContent="space-between" display="flex" flexDirection="column" marginLeft="18px" paddingRight="15px">
          <div className="dapp-menu-external-links">
            {externalUrls.map(({ url, icon, title, label }, i) => {
              return (
                <Link key={i} href={url} target="_blank" component={url ? "a" : "span"} className = "button-dapp-menu bg-color-sidebar-btn">
                  
                  <Typography variant="h6">{icon}</Typography>
                  <Typography variant="h6">{title}</Typography>
                  {label ? (
                    <Typography variant="caption" style={{ marginLeft: "8px" }}>
                      {label}
                    </Typography>
                  ) : null}
                </Link>
              );
            })}
          </div>
          
          <div className="dapp-menu-social">
            <Social />
          </div>
        </Box> */}
      </Box>
    </CustomePaper>
  );
}

export default NavContent;
