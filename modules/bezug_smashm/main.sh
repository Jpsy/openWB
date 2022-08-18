#!/bin/bash
OPENWBBASEDIR=$(cd "$(dirname "$0")/../../" && pwd)
RAMDISKDIR="${OPENWBBASEDIR}/ramdisk"
#DMOD="EVU"
DMOD="MAIN"

if [ ${DMOD} == "MAIN" ]; then
	MYLOGFILE="${RAMDISKDIR}/openWB.log"
else
	MYLOGFILE="${RAMDISKDIR}/evu.log"
fi

bash "$OPENWBBASEDIR/packages/legacy_run.sh" "modules.sma_shm.device" "counter" "${smashmbezugid}" >>"${MYLOGFILE}" 2>&1
ret=$?
openwbDebugLog ${DMOD} 2 "EVU RET: ${ret}"

cat "${RAMDISKDIR}/wattbezug"
