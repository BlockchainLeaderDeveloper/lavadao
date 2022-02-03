import { useState, useEffect } from "react";
import { addresses, TOKEN_DECIMALS } from "../../constants";
import { getTokenImage } from "../../helpers";
import { useSelector } from "react-redux";
import { Link, SvgIcon, Popper, Button, Paper, Typography, Divider, Box, Fade, Slide } from "@material-ui/core";
import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";
import { ReactComponent as sLavaTokenImg } from "../../assets/tokens/token_sLAVA.svg";
import { ReactComponent as LavaTokenImg } from "../../assets/tokens/token_LAVA.svg";
import { ReactComponent as t33TokenImg } from "../../assets/tokens/token_33T.svg";

import "./ohmmenu.scss";
import { mim } from "src/helpers/AllBonds";
import { useWeb3Context } from "../../hooks/web3Context";

import LavaImg from "src/assets/tokens/token_LAVA.svg";
import sLavaImg from "src/assets/tokens/token_sLAVA.svg";
import token33tImg from "src/assets/tokens/token_33T.svg";

const addTokenToWallet = (tokenSymbol, tokenAddress) => async () => {
  if (window.ethereum) {
    const host = window.location.origin;
    // NOTE (appleseed): 33T token defaults to sBHD logo since we don't have a 33T logo yet
    let tokenPath;
    // if (tokenSymbol === "BHD") {

    // } ? BhdImg : SBhdImg;
    switch (tokenSymbol) {
      // case "BHD":
      //   tokenPath = BhdImg;
      //   break;
      case "33T":
        tokenPath = token33tImg;
        break;
      case "LAVA" :
        tokenPath = LavaImg;
        break;
      case "sLAVA" :
        tokenPath = sLavaImg;
        break;
      default:
        tokenPath = SBhdImg;
    }
    const imageURL = `${host}/${tokenPath}`;

    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: TOKEN_DECIMALS,
            image: imageURL,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
};

function BhdMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const isEthereumAPIAvailable = window.ethereum;
  const { chainID } = useWeb3Context();

  const networkID = chainID;

  const SLAVADAO_ADDRESS = addresses[networkID].SLAVADAO_ADDRESS;
  const LAVADAO_ADDRESS = addresses[networkID].LAVADAO_ADDRESS;
  // const USDC_ADDRESS = addresses[networkID].USDC_ADDRESS;

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = "ohm-popper";
  const mimAddress = mim.getAddressForReserve(networkID);
  return (
    <Box
      component="div"
      onMouseEnter={e => handleClick(e)}
      onMouseLeave={e => handleClick(e)}
      id="ohm-menu-button-hover"
    >
      <Button id="ohm-menu-button" size="large" variant="contained" color="secondary" title="LAVA" aria-describedby={id}>
        {/* <SvgIcon component={InfoIcon} color="primary" /> */}
        <Typography>LAVA</Typography>
      </Button>

      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start" transition>
        {({ TransitionProps }) => {
          return (
            <Fade {...TransitionProps} timeout={100}>
              <Paper className="ohm-menu" elevation={1}>
                <Box component="div" className="buy-tokens">
                  <Link
                    href={`https://traderjoexyz.com/#/trade?inputCurrency=&outputCurrency=0x30b38a3Dec04E63f4BA5147C0Fdcd7F11df2700A`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left">
                      Buy on Trader Joe <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                      </Typography>
                    </Button>
                  </Link>

                  {/* <Link
                    href={`https://swap.spiritswap.finance/#/add/${USDC_ADDRESS}/${LAVADAO_ADDRESS}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left">
                        Buy on SpiritSwap <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                      </Typography>
                    </Button>
                  </Link> */}

                  {/* <Link href={`https://abracadabra.money/pool/10`} target="_blank" rel="noreferrer">
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left">
                        Wrap sBHD on Abracadabra <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                      </Typography>
                    </Button>
                  </Link> */}
                </Box>

                {/* <Box component="div" className="data-links">
                  <Divider color="secondary" className="less-margin" />
                  <Link href={`https://dune.xyz/shadow/Olympus-(BHD)`} target="_blank" rel="noreferrer">
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left">
                        Shadow's Dune Dashboard <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                      </Typography>
                    </Button>
                  </Link>
                </Box> */}

                {isEthereumAPIAvailable ? (
                  <Box className="add-tokens">
                    <Divider color="secondary" />
                    <p>ADD TOKEN TO WALLET</p>
                    <Box display="flex" flexDirection="row" justifyContent="space-between">
                      <Button variant="contained" color="secondary" onClick={addTokenToWallet("LAVA", LAVADAO_ADDRESS)}>
                        <SvgIcon
                          component={LavaTokenImg}
                          viewBox="0 0 32 32"
                          style={{ height: "36px", width: "36px" }}
                        />
                        <Typography variant="body1">LAVA</Typography>
                      </Button>
                      <Button variant="contained" color="secondary" onClick={addTokenToWallet("sLAVA", SLAVADAO_ADDRESS)}>
                        <SvgIcon
                          component={sLavaTokenImg}
                          viewBox="0 0 32 32"
                          style={{ height: "36px", width: "36px" }}
                        />
                        <Typography variant="body1">sLAVA</Typography>
                      </Button>
                      {/* <Button variant="contained" color="secondary" onClick={addTokenToWallet("33T", PT_TOKEN_ADDRESS)}>
                        <SvgIcon
                          component={t33TokenImg}
                          viewBox="0 0 1000 1000"
                          style={{ height: "25px", width: "25px" }}
                        />
                        <Typography variant="body1">33T</Typography>
                      </Button> */}
                    </Box>
                  </Box>
                ) : null}

                {/* <Divider color="secondary" />
                <Link
                  href="https://docs.app.hectordao.com/using-the-website/unstaking_lp"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button size="large" variant="contained" color="secondary" fullWidth>
                    <Typography align="left">Unstake Legacy LP Token</Typography>
                  </Button>
                </Link> */}
              </Paper>
            </Fade>
          );
        }}
      </Popper>
    </Box>
  );
}

export default BhdMenu;
