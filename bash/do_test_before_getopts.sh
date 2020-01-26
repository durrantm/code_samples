#!/bin/bash
. colors_for_text.sh 2> /dev/null

declare -i test_runs=0
declare -i test_passes=0
declare -i test_fails=0

do_test () {
  if [[ $# -eq 0 ]]; then
    printf "$fail_color Error - do_test: No parameters provided - Usage is do_test [function_name] \$LINENO [expected result]\n"
    exit 1
  elif [[ $# -eq 1 ]]; then
    printf "$fail_color Error - do_test: Two parameters missing - \$LINENO and expected result\n"
    exit 1
  fi
  if type "setup" > /dev/null 2>&1; then
    setup
  fi
  function_under_test="$1";shift
  line_number="$1";shift
  if [[ $1 == "-d" ]]; then
    debug=True
    shift
  else
    debug=False
  fi
  param=`echo $1 | cut -c 1-2`
  if [[ $param == "-m" ]]; then
    msg=" (`echo $1 | cut -c 3-`)"
    shift
  else
    msg=""
  fi
  if [[ $# -eq 0 ]]; then
    printf "$fail_color Error - do_test: Third parameter missing - expected result\n"
    exit 1
  fi
  expected="$1";shift
  pass_on_params=("$@")

  $function_under_test ${pass_on_params[@]}
  if [[ "$expected" =~ ^-?[0-9]+$ ]]; then
      [[ "$result" -eq $expected ]] && record_success || record_failure $function_under_test;
  else
      [[ "$result" == $expected ]] && record_success || record_failure $function_under_test;
  fi
}
record_success () {
  printf "$pass_color"."$color_end"
  [[ ! -z $msg ]] && printf $msg
  test_runs+=1
  test_passes+=1
}
record_failure () {
  local function=$1
  printf "$fail_color"F"$color_end"
  test_runs+=1
  test_fails+=1
  function_exists "$function" &&
  error_messages=$error_messages"$fail_color""Line: $line_number$msg \
Call to '$function ${pass_on_params[@]}' failed:\n\
Expected: $expected\n\
Received: $result $color_end\n" ||
  error_messages=$error_messages"$fail_color""Line: $line_number: Function '$function' is undefined\n"
  msg=''
}
function_exists() {
    declare -f -F $1 > /dev/null
    return $?
}
debug_echo () {
  [[ "$debug" == "True" ]] && echo "$1"
}
debug_printf () {
  [[ "$debug" == "True" ]] && printf "$1"
}
