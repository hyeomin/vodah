import { View, Text, Linking, Pressable, StyleSheet } from "react-native";
import SvgIcons from "@/components/icons/SvgIcons";

export default function Footer() {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.infoBlock}>
        <View style={styles.linkRow}>
          <Text style={styles.linkText}>고객 센터 바로가기</Text>
          <Pressable onPress={() => Linking.openURL('https://your-customer-center-url.com')} style={styles.iconButton} hitSlop={8}>
            <SvgIcons.ExternalLinkIcon style={{ marginBottom: 4 }} />
          </Pressable>
        </View>
        <Text style={styles.timeText}>운영시간 : 매일 오전 6시 ~ 오후 10시</Text>
      </View>
      <View style={styles.companyBlock}>
        <Text style={styles.companyText}>
          주식회사 모먼트 | 대표 박혜민 | 사업자번호 000-00-00000
        </Text>
        <Text style={styles.companyText}>
          연락처 0502-1939-0086 | 통신판매업
        </Text>
        <Text style={styles.companyText}>주소</Text>
      </View>
      <Text style={styles.moment}>moment</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    width: '100%',
    backgroundColor: '#EBEBF6',
    paddingVertical: 30,
    paddingHorizontal: 20,
    gap: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  infoBlock: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 0,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
    height: 17,
    marginBottom: 0,
  },
  linkText: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: 0.001,
    color: '#666666',
    height: 17,
  },
  iconButton: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  timeText: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: 0.001,
    color: '#666666',
    height: 15,
  },
  companyBlock: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 0,
  },
  companyText: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: 0.001,
    color: '#666666',
    height: 15,
  },
  moment: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 20,
    lineHeight: 30,
    color: '#000',
    marginTop: 0,
  },
});