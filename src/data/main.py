import pandas as pd
import json

df_columns = ['종목코드', '회사명', '시장구분', '자본총계', '당기순이익(손실)', 'ROE', '전기 ROE', '전전기 ROE', 'EPS']
df = pd.DataFrame(columns=df_columns)

'''
2021년 1분기 
'''
finstate = pd.read_csv('2021/1.tsv', sep='\t')
finstate = finstate[finstate["항목코드"] == "ifrs-full_Equity"] # 자본총액

incomestate = pd.read_csv('2021/2.tsv', sep='\t')
epsstate = incomestate[incomestate["항목코드"] == "ifrs-full_BasicEarningsLossPerShare"] # 주당순이익
incomestate = incomestate[incomestate["항목코드"] == "ifrs-full_ProfitLoss"] # 당기순이익(손실)

'''
2020년 4분기 
'''
finstate_2020 = pd.read_csv('2020/1.tsv', sep='\t')
finstate_2020 = finstate_2020[finstate_2020["항목코드"] == "ifrs-full_Equity"] # 자본총액

incomestate_2020 = pd.read_csv('2020/2.tsv', sep='\t')
incomestate_2020 = incomestate_2020[incomestate_2020["항목코드"] == "ifrs-full_ProfitLoss"] # 당기순이익(손실)


for index, row in finstate.iterrows():
    df_name = row[df_columns[:3]]
    df_full_eq = row["당기 1분기말"]
    df_full_pl = incomestate[incomestate['종목코드'] == row['종목코드']].iloc[:, 12]
    if df_full_pl.empty :
        continue
    df_full_pl = df_full_pl.iloc[0]
    if pd.isna(df_full_eq) :
        continue
    if pd.isna(df_full_pl) :
        df_full_pl = incomestate[incomestate['종목코드'] == row['종목코드']].iloc[:, 13]
        df_full_pl = df_full_pl.iloc[0]
        if pd.isna(df_full_pl) :
            continue
    df_full_eq = int(df_full_eq.replace(',',''))
    df_full_pl = int(df_full_pl.replace(',',''))
    df_roe = (df_full_pl/df_full_eq)*100
    if df_full_eq < 0 and df_full_pl < 0 :
        df_roe = 0
    df_name[df_columns[3]] = df_full_eq
    df_name[df_columns[4]] = df_full_pl
    df_name[df_columns[5]] = df_roe

    # 2020-4
    df_full_eq = finstate_2020[finstate_2020['종목코드'] == row['종목코드']].iloc[:, 12]
    df_full_pl = incomestate_2020[incomestate_2020['종목코드'] == row['종목코드']].iloc[:, 13]
    if not df_full_eq.empty and not df_full_pl.empty :
        df_full_eq = df_full_eq.iloc[0]
        df_full_pl = df_full_pl.iloc[0]
        if not pd.isna(df_full_eq) and not pd.isna(df_full_pl) :
            df_full_eq = int(df_full_eq.replace(',',''))
            df_full_pl = int(df_full_pl.replace(',',''))
            df_name[df_columns[6]] = 0 if df_full_eq < 0 and df_full_pl < 0 else (df_full_pl/df_full_eq)*100

    # 2020-3
    df_full_eq = finstate_2020[finstate_2020['종목코드'] == row['종목코드']].iloc[:, 13]
    df_full_pl = incomestate_2020[incomestate_2020['종목코드'] == row['종목코드']].iloc[:, 16]
    if not df_full_eq.empty and not df_full_pl.empty :
        df_full_eq = df_full_eq.iloc[0]
        df_full_pl = df_full_pl.iloc[0]
        if not pd.isna(df_full_eq) and not pd.isna(df_full_pl) :
            df_full_eq = int(df_full_eq.replace(',',''))
            df_full_pl = int(df_full_pl.replace(',',''))
            if df_full_eq != 0 :
                df_name[df_columns[7]] = 0 if df_full_eq < 0 and df_full_pl < 0 else (df_full_pl/df_full_eq)*100

    df_eps = epsstate[epsstate['종목코드'] == row['종목코드']].iloc[:, 12]
    if not df_eps.empty :
        df_eps = df_eps.iloc[0]
        if not pd.isna(df_eps) :
            df_eps = int(df_eps.replace(',',''))
            df_name[df_columns[8]] = df_eps
    df = df.append(df_name, ignore_index=True)



df = df.sort_values(by=["ROE"], axis=0, ascending=False)
df = df.dropna()
#df = df[(df[df_columns[5]]>5) & (df[df_columns[6]]>5) & (df[df_columns[7]]>5)]

# columns save
column_json = []
for cl in df.columns[1:] :
    column = {}
    column["Header"] = cl
    column["id"] = cl
    if cl in df_columns[3:] :
        column["isNumeric"] = True
    column_json.append(column)

with open("column.json", "w") as outfile :
    json.dump(column_json, outfile)

# data save
data_json = []
for index, row in df.iterrows():
    data = {}
    for c in df_columns[1:] :
        data[c] = row[c]
    data_json.append(data)

with open("data.json", "w") as outfile :
    json.dump(data_json, outfile)

#df.to_json("result.json")
#print(list(df["회사명"]))