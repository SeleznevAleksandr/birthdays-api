build:
	npm run build

init:
	aws-vault exec flatstack_warsaw -- terraform init

apply:
	aws-vault exec flatstack_warsaw -- terraform apply

destroy:
	aws-vault exec flatstack_warsaw -- terraform destroy

deploy: build apply

invoke:
	aws-vault exec flatstack_warsaw -- aws lambda invoke --function-name birthdays-fetcher-lambda response.json
