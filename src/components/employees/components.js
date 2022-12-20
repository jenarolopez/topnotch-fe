import styled from "styled-components";

export const EmployeeContainer = styled.div`
display: flex;
align-items: center;
width: 100%;
    & .rated {
        color: rgb(248, 195, 116) !important;
    }
    & > td {
        flex:1;
        font-size: 0.9em;

        & > div {
            display: flex;
            flex-direction: column;
            justify-content: right;
            text-align: left;
            padding-top: 20px;
            

           

            

        } 

        & > img {
            width: 100%;
            max-width: 50px;
            max-height: 50px;
            border-radius: 50%;
        }
        & > i {
            font-size: 2em;
            cursor: pointer;
            padding: 10px;
            transition: all .3s ease-in-out;
            &:hover {
                box-shadow: 1px 3px 5px gray;
            }
        }
    }
`