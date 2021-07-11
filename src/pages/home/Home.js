import { Flex, Button, Heading } from "@chakra-ui/react";
import { Layout } from "components/layout";
import CompanyTable from "./CompanyTable";
import data_json from "data/data";
import column_json from "data/column";
import { useMemo, useState } from 'react';
import { } from 'react-table';


function Home() {
    const data = useMemo(
        () => data_json,
        [],
    )
    const columns = useMemo(
        () => column_json.map((c)=>{
            let column = c
            const id = column["id"]
            if (Object.keys(column).indexOf("isNumeric") != -1) {
                column["accessor"] = d => Number(d[id]).toLocaleString("en")
                column["sortable"] = true
                column["sortType"] = (a, b, ci) => {
                    let a_int = Number(a.original[ci])
                    let b_int = Number(b.original[ci])
                    return a_int - b_int
                };
            } else {
                column["accessor"] = d => d[id]
            }
            return column
        }),
        [],
    )
    function range(start, end) {
        let final_end = Math.min(Math.floor(data_json.length/10), end)
        return Array(final_end - start + 1).fill().map((_, idx) => start + idx)
    }
    const [slice, setSlice] = useState(0)

    return (
        <Flex flexDir="column" align="center" minH="100vh">
            <Heading size="2xl" mt="12" mb="12" color="Black">
            한국 주식 2021 ROE, EPS 한 눈에 보기
            </Heading>
            <Flex justify="center" mb="12">
                <CompanyTable columns={columns} data={data} slice={slice}/>
            </Flex>
            <Flex justify="center">
                {Math.floor(slice/10) > 0?
                    <Button onClick={()=>setSlice(0)}>
                        {"<<"}
                    </Button>
                :""}
                {Math.floor(slice/10) > 0?
                    <Button onClick={()=>setSlice((Math.floor(slice/10)-1)*10)}>
                        {"<"}
                    </Button>
                :""}
                {range(Math.floor(slice/10)*10, Math.floor(slice/10+1)*10-1).map(
                    (i) => (
                    <Button isDisabled={i==slice}
                            onClick={()=>setSlice(i)}
                    >
                        {i+1}
                    </Button>)
                )}
                {Math.floor(slice/10) < Math.floor(Math.floor(data_json.length/10)/10)?
                    <Button onClick={()=>setSlice((Math.floor(slice/10)+1)*10)}>
                        {">"}
                    </Button>
                :""}
                {Math.floor(slice/10) < Math.floor(Math.floor(data_json.length/10)/10)?
                    <Button onClick={()=>setSlice(Math.floor(data_json.length/10))}>
                        {">>"}
                    </Button>
                :""}
            </Flex>
        </Flex>
    );
}

export { Home };
