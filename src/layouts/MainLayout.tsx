import React from "react";
import styled from "styled-components";
import { Layout } from "antd";
import { FacebookFilled, InstagramFilled } from "@ant-design/icons";

const { Footer } = Layout;

type TProps = {
    children: React.ReactNode;
};

const FooterItemTopStyled = styled.div`
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    padding: 20px 0 5px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const AboutStyled = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;

    @media (max-width: 800px) {
        & p {
            width: 100%;
            text-align: center;
        }
    }
`;

const FooterItemBottomStyled = styled.div`
    margin-top: 20px;
    line-height: 2;
    text-align: center;
`;

const ListStyled = styled.ul`
    li {
        margin: 10px 0;
    }
`;

export default function MainLayout({ children }: TProps) {
    return (
        <Layout>
            <Layout>{children}</Layout>
            <Footer>
                <FooterItemTopStyled>
                    <AboutStyled>
                        <div>
                            <h4>Chăm sóc khách hàng</h4>
                            <ListStyled>
                                <li>Trung tâm trợ giúp</li>
                                <li>TG2H Blog</li>
                                <li>TG2H Mall</li>
                                <li>Hướng dẫn mua hàng</li>
                                <li>Hướng dẫn bán hàng</li>
                            </ListStyled>
                        </div>
                        <div>
                            <h4>Về TG2H</h4>
                            <ListStyled>
                                <li>Giới thiệu về TG2H Việt Nam</li>
                                <li>Tuyển dụng</li>
                                <li>Điều khoản TG2H</li>
                                <li>Chính sách bảo mật</li>
                            </ListStyled>
                        </div>

                        <div>
                            <h4>Theo dõi chúng tôi trên</h4>
                            <ListStyled>
                                <li>
                                    <FacebookFilled /> facebook
                                </li>
                                <li>
                                    <InstagramFilled /> instagram
                                </li>
                            </ListStyled>
                        </div>
                    </AboutStyled>
                    <AboutStyled>
                        <p>&#169; TG2H. Tất cả các quyền được bảo lưu.</p>
                        <p>Quốc gia/khu vực: Việt Nam</p>
                    </AboutStyled>
                </FooterItemTopStyled>
                <FooterItemBottomStyled>
                    <p>
                        Địa chỉ: Đường 3/2, Phường Xuân Khánh, Quận Ninh Kiều, Thành phố
                        Cần Thơ - Tổng đài hỗ trợ: 0946310531 - Email:
                        baophan.developer@gmail.com
                    </p>
                    <p>&#169; 2023 - Bản quyền thuộc về BaoPhan </p>
                </FooterItemBottomStyled>
            </Footer>
        </Layout>
    );
}
