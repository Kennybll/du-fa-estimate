import {
  Page,
  Document,
  StyleSheet,
  Image,
  View,
  Text,
  Font,
  Link,
} from "@react-pdf/renderer";
import day from "dayjs";
import currency from "currency.js";
import { FC, ReactNode } from "react";
import { Aid, Class, DocumentProps, Fee } from "./types";

Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
      fontWeight: 600,
    },
  ],
});

// Create styles
export const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    fontSize: 11,
    fontFamily: "Open Sans",
    fontWeight: 400,
  },
  viewer: {
    width: window.innerWidth, //the pdf viewer will take up all of the width and height
    height: window.innerHeight,
  },
  logo: {
    width: "200px",
    alignSelf: "center",
    marginTop: "2cm",
  },
  content: {
    marginLeft: "2cm",
    marginRight: "2cm",
  },
  line: {
    width: "100%",
    height: 0.5,
    backgroundColor: "black",
  },
  spacer: {
    marginTop: "8px",
  },
});

const Spacer = () => <View style={styles.spacer} />;

const Bold: FC<{ children: ReactNode }> = ({ children }) => (
  <Text style={{ fontWeight: "bold" }}>{children}</Text>
);

const HR = () => <View style={{ ...styles.line, marginTop: "8px" }} />;

const RenderClass: FC<{ class: Class }> = (props) => {
  const cost = currency(props.class.cost * props.class.creditHours);
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text>
        {props.class.id} - {props.class.creditHours} credits
      </Text>
      <Text>{cost.format()}</Text>
    </View>
  );
};

const RenderFee: FC<{ fee: Fee }> = (props) => {
  const name = props.fee.isCourseFee
    ? `Course Fee - ${props.fee.name}`
    : props.fee.name;
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text>{name}</Text>
      <Text>{currency(props.fee.cost).format()}</Text>
    </View>
  );
};

const RenderAid: FC<{ aid: Aid }> = (props) => (
  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
    <Text>{props.aid.name}</Text>
    <Text>{currency(props.aid.amount).format()}</Text>
  </View>
);

// Create Document Component
export const MyDocument = ({
  semester,
  studentId,
  studentName,
  classes = [],
  fees = [],
  aidYear,
  aid = [],
}: DocumentProps) => {
  const estimatedTuition = currency(
    classes.reduce((acc, cur) => acc + cur.cost * cur.creditHours, 0),
  );
  const feesSum = currency(fees.reduce((acc, cur) => acc + cur.cost, 0));
  const aidSum = currency(aid.reduce((acc, cur) => acc + cur.amount, 0));
  const balance = estimatedTuition.add(feesSum).subtract(aidSum);
  return (
    <Document
      title={`${studentName} ${semester} Estimate`}
      author="Davenport University"
    >
      <Page size="LETTER" style={styles.page}>
        <Image src={"/logo.png"} style={styles.logo} fixed />
        <View style={styles.content}>
          <Bold>Estimate {semester}</Bold>
          <Text>{day().format("MMM DD, YYYY")}</Text>
          <Text>
            Student Name: {studentName}&nbsp;&nbsp;&nbsp;&nbsp;Student ID:{" "}
            {studentId}
          </Text>
          <HR />
          <Text>{semester}</Text>

          <Spacer />
          <Bold>Tuition</Bold>
          {classes.map((c) => (
            <RenderClass class={c} />
          ))}
          <Spacer />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>Total estimated tuition</Text>
            <Text>{estimatedTuition.format()}</Text>
          </View>

          <Spacer />
          <Bold>Fees (based on {aidYear} fees)</Bold>
          {fees.map((f) => (
            <RenderFee fee={f} />
          ))}
          <Spacer />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>Total estimated fees</Text>
            <Text>{feesSum.format()}</Text>
          </View>

          <Spacer />
          <Bold>Financial Aid</Bold>
          {aid.map((a) => (
            <RenderAid aid={a} />
          ))}
          <Spacer />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>Total estimated financial aid</Text>
            <Text>{aidSum.format()}</Text>
          </View>

          <Spacer />
          <Bold>Balance</Bold>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>Total estimated balance</Text>
            <Text>{balance.format()}</Text>
          </View>
        </View>
        <View
          style={{
            textAlign: "center",
            fontSize: 10,
            position: "absolute",
            bottom: "2cm",
            left: 0,
            right: 0,
          }}
          fixed
        >
          <Text>Financial Aid Office</Text>
          <Text>
            6191 Kraft Avenue SE | Grand Rapids, MI 49512 | 616-732-1130 |
            866-774-0004 | Fax: 616-732-1141
          </Text>
          <Text>
            <Link src="mailto:financialaid@davenport.edu">
              financialaid@davenport.edu
            </Link>{" "}
            | <Link src="https://www.davenport.edu">www.davenport.edu</Link>
          </Text>
        </View>
      </Page>
    </Document>
  );
};
