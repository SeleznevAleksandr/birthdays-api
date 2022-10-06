build:
	npm run build

deploy:
	aws-vault exec flatstack_warsaw -- cdk deploy

state_diff:
	aws-vault exec flatstack_warsaw -- cdk diff

invoke:
	aws-vault exec flatstack_warsaw -- aws lambda invoke --function-name birthdays-fetcher-api response.json
